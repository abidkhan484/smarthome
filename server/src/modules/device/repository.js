const { name: ModelName } = require("./model");
const mongoose = require("mongoose");

const getDeviceAndBrokerInfoUsingJoinWithUsers = async (query) => {
  const result = mongoose.models[ModelName].aggregate(query).lean().exec();
  return result;
};

module.export = {
  getDeviceAndBrokerInfoUsingJoinWithUsers
}
