import express from 'express';
import { getUser, createUser } from '@controllers/users.controllers';
import { createUserSchema } from '@schemas/users.schema';
import { validates } from '@middleware/joi.middleware';

export const UsersRoute = (route: express.Router) => {
  route.get('/users', getUser);
  route.post('/users', validates(createUserSchema), createUser);
};
