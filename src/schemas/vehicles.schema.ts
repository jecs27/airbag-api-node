import * as Joi from 'joi';

export const createVehicleSchema: Joi.ObjectSchema = Joi.object().keys({
  licensePlate: Joi.string().min(7).max(10).required(),
  vin: Joi.string().min(17).max(17).required(),
  make: Joi.string().required(),
  vehicleType: Joi.string().required()
});

export const updateVehicleSchema: Joi.ObjectSchema = Joi.object().keys({
  id: Joi.string().required(),
  licensePlate: Joi.string().min(7).max(10).required(),
  make: Joi.string().required(),
  vehicleType: Joi.string().required()
});