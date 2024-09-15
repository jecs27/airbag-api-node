import express from 'express';
import { getUsers, createUsers, signIn, login } from '@controllers/users.controllers';
import { createUserSchema, loginSchema, signInSchema } from '@schemas/users.schema';
import { validates } from '@middleware/joi.middleware';
import { validateToken } from '@middleware/auth.middleware';

export const UsersRoute = (route: express.Router) => {
  route.get('/users', validateToken, getUsers);
  route.post('/users', validates(createUserSchema), createUsers);
  route.post('/users/sign-in', validates(signInSchema), signIn);
  route.post('/login', validates(loginSchema), login);
};
