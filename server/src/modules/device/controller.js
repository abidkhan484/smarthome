const express = require("express");
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
const logger = require("../../core/logger");

const router = express.Router();

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
  logger.info(`Broker emit is starting`);
  eventEmitter.emit("msgToBroker", {
    userId: req.user.id,
    topic: topic,
    message: status.toString(),
  });
  await updateHandler(req, res, next);
};

router.get("/detail", getByIdHandler);
router.post("/create", handleValidation(validate), saveHandler);
router.post("/search", searchHandler);
router.post("/count", countHandler);
router.put("/status/update", handleValidation(validate), updateDeviceStatus);

module.exports = router;
