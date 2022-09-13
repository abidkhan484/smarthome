const Joi = require("joi");

const schema = Joi.object().keys({
  _id: Joi.string().optional(),
  topic: Joi.string().min(2).max(30).optional(),
  status: Joi.number().integer().min(0).max(1).required(),
});

const validate = (data) => {
  const result = schema.validate(data);
  result.value = data;
  return result;
};

module.exports = { validate };
