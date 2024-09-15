import * as Joi from 'joi';

export const createUserSchema: Joi.ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(10).required(),
  name: Joi.string().min(3).max(50).required(),
});
