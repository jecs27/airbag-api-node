import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { UsersRoute } from '@routes/users.routes';
import { VehiclesRoute } from '@routes/vehicles.routes';

import { listRoutes } from './utils/routes.helper';
import connectDB from '@database/nosql/connection';

import { syncUsersJob } from './jobs/users.jobs';
import { requestLogger } from '@middleware/requestLoger.middleware';

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('etag');

app.use(requestLogger);
UsersRoute(app);
VehiclesRoute(app);

connectDB();
syncUsersJob();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
});


app.listen(port, () => {
  console.log(`[server]: Server is running  http://localhost:${port}`);
  listRoutes(app);
  app.get('/', (_req, res) => {
    res.send('[server]: Server is running');
  });
});
