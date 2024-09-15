import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { UsersRoute } from '@routes/users.routes';

import * as packagesJson from '../package.json';
import { listRoutes } from './utils/routes.helper';

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

app.listen(port, () => {
  console.log(`[server]: Server is running  http://localhost:${port} - V${packagesJson.version}`);
  listRoutes(app);
  app.get('/', (_req, res) => {
    res.send('[server]: Server is running');
  });
});
