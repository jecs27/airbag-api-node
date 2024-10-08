import express from 'express';
import { validates } from '@middleware/joi.middleware';
import { validateToken } from '@middleware/auth.middleware';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, getVehicleById } from '@controllers/vehicles.controllers';
import { createVehicleSchema, updateVehicleSchema } from '@schemas/vehicles.schema';

export const VehiclesRoute = (route: express.Router) => {
  route.get('/vehicles', validateToken, getVehicles);
  route.get('/vehicles/:id', validateToken, getVehicleById);
  route.post('/vehicles', validateToken, validates(createVehicleSchema), createVehicle);
  route.put('/vehicles/:id', validateToken, validates(updateVehicleSchema), updateVehicle);
  route.delete('/vehicles/:id', deleteVehicle);
};
