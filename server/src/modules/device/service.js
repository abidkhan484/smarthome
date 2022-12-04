const { ObjectId } = require("mongoose").Types;
const { getDeviceAndBrokerInfoUsingJoinWithUsers } = require("./repository");

const getQuery = (payload) => {
  const query = { userId: ObjectId(payload.userId) };
  return query;
};

const getDeviceAndBrokerInfoOfUser = async (userId, topic) => {
  const query = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },
    {
      $project: {
        deviceId: 1,
        publishTopic: 1,
        "userId._id": 1,
        "userId.username": 1,
        "userId.brokerPasswordHash": 1,
      },
    },
    {
      $match: {
        "userId._id": ObjectId(userId),
        publishTopic: topic,
      },
    },
    {
      $limit: 1,
    },
  ];

  const result = await getDeviceAndBrokerInfoUsingJoinWithUsers(query);
  return result;
};

module.exports = {
  getQuery,
  getDeviceAndBrokerInfoOfUser,
};
