const routes = require("./controller");
const {
  authenticateRequest,
  //   authorizeRequest,
} = require("../../common/middlewares");
const { name: ModelName } = require("./model");

const processRequest = async (req, res, next) => {
  req.modelName = ModelName;
  return next();
};

const init = async (app) => {
  app.use(
    "/api/devices",
    authenticateRequest,
    // authorizeRequest,
    processRequest,
    routes
  );

  app.use(() => {
    require("./mqtt-handler");
  });

  return app;
};

module.exports = { init };
