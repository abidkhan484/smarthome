const MQTT = require("async-mqtt");
const eventEmitter = require("../../core/event-manager").getInstance();
const logger = require("../../core/logger");
const { getDeviceAndBrokerInfoOfUser } = require("./service");

const sendMessage = async (topic, message, options) => {
  logger.info(`Sending message mqtt`);
  const client = MQTT.connect(process.env.BROKER_URL, options);
  try {
    await client.publish(topic, message, options);
  } catch (e) {
    logger.info(`MQTT send message error ${e.stack}`);
    logger.info(`Broker emit failed with userId ${userId} and topic ${topic}`);
    process.exit();
  }
};

eventEmitter.on("msgToBroker", async ({ userId, topic, message }) => {
  const deviceData = await getDeviceAndBrokerInfoOfUser(userId, topic);
  if (! deviceData) {
    logger.info(`Broker info not found in DB with userId ${userId} and topic ${topic}`);
    process.exit();
  }
  // decrypt the broker hashed password
  const password = deviceData.userId.brokerPasswordHash;
  const clientId = `${deviceData.userId.username}_${deviceData.deviceId}`;
  const options = {
    retain: true,
    connectTimeout: process.env.BROKER_CONNECT_TIMEOUT,
    clientId: clientId,
    username: deviceData.userId.username,
    password: password,
  };
  await sendMessage(topic, message, options);
});
