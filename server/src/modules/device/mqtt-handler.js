const MQTT = require("async-mqtt");
const eventEmitter = require("../../core/event-manager").getInstance();
const logger = require("../../core/logger");
const { getDeviceAndBrokerInfoOfUser } = require("./service");

const sendMessage = async (topic, message, options) => {
  logger.info(`message publishing with topic ${topic} and message ${message}`);
  const client = MQTT.connect(process.env.BROKER_URL, options);
  try {
    await client.publish(topic, message, options);
    await client.end();
  } catch (e) {
    logger.info(`MQTT send message error ${e.stack}`);
    logger.info(`Broker emit failed with userId ${userId} and topic ${topic}`);
    process.exit();
  }
};

eventEmitter.on("msgToBroker", async ({ userId, topic, message }) => {
  const deviceData = await getDeviceAndBrokerInfoOfUser(userId, topic);
  logger.info(`${userId} with topic ${topic} and status ${message}`);
  if (! deviceData) {
    logger.info(`Broker info not found in DB with userId ${userId} and topic ${topic}`);
    process.exit();
  }
  const clientId = `${deviceData.userId.username}_${deviceData.deviceId}`;
  const options = {
    retain: true,
    connectTimeout: process.env.BROKER_CONNECT_TIMEOUT,
    clientId: clientId,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    qos: 2,
  };
  await sendMessage(topic, message, options);
});
