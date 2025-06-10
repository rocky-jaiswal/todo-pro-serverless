// This module is only for local testing
import 'dotenv/config';
import pino from 'pino';
import cors from 'cors';

import { createHTTPServer } from '@trpc/server/adapters/standalone';

import { router } from '../routers';

const logger = pino();

const server = createHTTPServer({
  router,
  basePath: '/v2/',
  middleware: cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200, // for legacy
  }),
  createContext: (event: any) => {
    return {
      event,
      apiVersion: '1.0',
      logger,
      token: event.req.headers['x-auth-token'] ?? undefined,
      userId: '',
    };
  },
});

server.listen(3000);
