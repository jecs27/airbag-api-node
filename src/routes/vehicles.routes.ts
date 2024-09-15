import express from 'express';
import { validates } from '@middleware/joi.middleware';
import { validateToken } from '@middleware/auth.middleware';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '@controllers/vehicles.controllers';
import { createVehicleSchema } from '@schemas/vehicles.schema';

export const VehiclesRoute = (route: express.Router) => {
  route.get('/vehicles', validateToken, getVehicles);
  route.post('/vehicles', validateToken, validates(createVehicleSchema), createVehicle);
  route.put('/vehicles/:id', validateToken, validates(createVehicleSchema), updateVehicle);
  route.delete('/vehicles/:id', validateToken, deleteVehicle);
};
