import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { UsersRoute } from '@routes/users.routes';
import { VehiclesRoute } from '@routes/vehicles.routes';

import * as packagesJson from '../package.json';
import { listRoutes } from './utils/routes.helper';
import connectDB from '@database/nosql/connection';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('etag');

UsersRoute(app);
VehiclesRoute(app);
connectDB();

app.listen(port, () => {
  console.log(`[server]: Server is running  http://localhost:${port} - V${packagesJson.version}`);
  listRoutes(app);
  app.get('/', (_req, res) => {
    res.send('[server]: Server is running');
  });
});
