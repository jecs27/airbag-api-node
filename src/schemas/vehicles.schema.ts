import * as Joi from 'joi';

export const createVehicleSchema: Joi.ObjectSchema = Joi.object().keys({
  licensePlate: Joi.string().required(),
  vin: Joi.string().required(),
  make: Joi.string().required(),
  vehicleType: Joi.string().required()
});
