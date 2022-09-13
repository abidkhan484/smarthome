const express = require("express");
const MQTT = require("async-mqtt");
const eventEmitter = require("../../core/event-manager").getInstance();
const {
  saveHandler,
  updateHandler,
  getByIdHandler,
  searchHandler: baseSearchHandler,
  countHandler: baseCountHandler,
} = require("../../core/controller");
const { validate } = require("./request");
const { handleValidation } = require("../../common/middlewares");
const { getQuery } = require("./service");

const router = express.Router();

const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: "EspClient00002",
  username: "misl",
  password: "Mirinfosys",
};

const client = MQTT.connect(process.env.BROKER_URL, options);

const checkConnectionStatus = async () => {
  console.log("Broker Connection Starting");
  try {
    await client.publish("wow/so/cool", "It works!");
    // await client.end();
    console.log("Broker Connection Established");
  } catch (e) {
    console.log(e.stack);
    process.exit();
  }
};

client.on("connect", checkConnectionStatus);

const devices = [
  {
    _id: "6316bcdc0d100af1607ee381",
    userId: "62d62a7eeff21875139c4d7e",
    deviceId: "switch2",
    subscribeTopic: "switch2_status",
    publishTopic: "switch2",
    status: 0,
  },
  {
    _id: "6316bcdc0d100af1607ee383",
    userId: "62d62a7eeff21875139c4d7e",
    deviceId: "switch4",
    subscribeTopic: "switch4_status",
    publishTopic: "switch4",
    status: 0,
  },
  {
    _id: "6316bcdc0d100af1607ee380",
    userId: "62d62a7eeff21875139c4d7e",
    deviceId: "switch1",
    subscribeTopic: "switch1",
    publishTopic: "switch1",
    status: 0,
  },
  {
    _id: "6316bcdc0d100af1607ee382",
    userId: "62d62a7eeff21875139c4d7e",
    deviceId: "switch3",
    subscribeTopic: "switch3_status",
    publishTopic: "switch3",
    status: 0,
  },
];

const searchHandler = async (req, res, next) => {
  req.searchQuery = getQuery({ ...req.body, userId: req.user.id });
  return baseSearchHandler(req, res, next);
};

const countHandler = async (req, res, next) => {
  req.searchQuery = getQuery({ ...req.body, userId: req.user.id });
  return baseCountHandler(req, res, next);
};

const updateDeviceStatus = async (req, res, next) => {
  const { topic, status } = req.body;
  await updateHandler(req, res, next);
  if (client.connected) {
    await client.publish(topic, status.toString());
  }
};

router.get("/detail", getByIdHandler);
router.post("/create", handleValidation(validate), saveHandler);
router.post("/search", searchHandler);
router.post("/count", countHandler);
router.put("/status/update", handleValidation(validate), updateDeviceStatus);

module.exports = router;
