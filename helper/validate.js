const Joi = require("@hapi/joi");



exports.validateUser = body => {
  const { name, email, phone, password } = body;
  // validate user attr
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(150)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });

  const result = Joi.validate({ name, email, phone, password }, schema);

  return result.error;
};
