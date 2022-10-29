const MQTT = require("async-mqtt");
const eventEmitter = require("../../core/event-manager").getInstance();
const logger = require("../../core/logger");

const sendMessage = async (options, topic, message) => {
  console.log("Broker Connection Starting");
  const client = MQTT.connect(process.env.BROKER_URL, options);
  try {
    await client.publish(topic, message);
  } catch (e) {
    logger.info(`MQTT send message error ${e.stack}`);
    process.exit();
  }
};

eventEmitter.on("msgToBroker", async ({ userId, topic, message }) => {
  // query to db according to the userId and set the options
  const options = {
    clean: true,
    connectTimeout: 4000,
    clientId: "****",
    username: "****",
    password: "****",
  };
  await sendMessage(options, topic, message);
});
