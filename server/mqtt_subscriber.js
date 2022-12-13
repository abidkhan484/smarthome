require("dotenv").config();
const mqtt = require("async-mqtt");
const logger = require("./src/core/logger");
const mongoose = require("mongoose");
const { name: ModelName } = require("./src/modules/device/model");
const connectWithDb = require("./src/core/mongo");

const clientId = `EspClient00002`;
const topic = "#";
const connectUrl = process.env.BROKER_URL;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  reconnectPeriod: 1000,
});

const run = async () => {
  console.log("Starting");
  try {
    await client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`);
    });
  } catch (e) {
    console.log(e.stack);
    process.exit();
  }

  client.on("message", async (topic, payload) => {
    const status = payload.toString();
    logger.info(`Got a message for topic ${topic} and message ${status}`);
    try {
      await mongoose.models[ModelName].updateOne(
        { subscribeTopic: topic },
        { status: parseInt(status) }
      ).exec();
    } catch (e) {
      logger.error(`MQTT subscribe message error ${e.stack}`);
      logger.error(
        `MQTT subscription failed for topic ${topic} and status ${status}`
      );
    }
  });
};


connectWithDb();
client.on("connect", run);
