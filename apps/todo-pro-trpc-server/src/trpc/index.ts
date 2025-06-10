import pino from 'pino';

import { type CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { type APIGatewayProxyEvent } from 'aws-lambda';
import { initTRPC } from '@trpc/server';
import { enforceUserIsAuthenticated, loggerMiddleware } from './middlewares';

const logger = pino();

export const createContext = async ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => {
  let token = null;
  const userId: string = '';

  if (event.headers && event.headers['x-auth-token']) {
    token = event.headers['x-auth-token'];
  }

  return {
    event: event,
    apiVersion: (event as { version?: string }).version ?? '1.0',
    token,
    logger,
    userId,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;
export const trpc = initTRPC.context<Context>().create();

export const publicProcedure = trpc.procedure.use(loggerMiddleware(trpc));
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthenticated(trpc));
