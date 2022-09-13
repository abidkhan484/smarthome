const { ObjectId } = require("mongoose").Types;
const { name } = require("./model");

const getQuery = (payload) => {
  const query = { userId: ObjectId(payload.userId) };
  return query;
};

module.exports = {
  getQuery,
  modelName: name,
};
