import pino from 'pino';

import { type CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { type APIGatewayProxyEventV2 } from 'aws-lambda';

import { initTRPC, TRPCError } from '@trpc/server';
import { validatetoken } from '../services/token';

const logger = pino();

export const createContext = async ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  const validated = await validatetoken(event.headers['x-auth-token']);

  const session = { userId: validated?.id, token: validated?.jwt };

  return {
    event: event,
    apiVersion: (event as { version?: string }).version ?? '1.0',
    session,
    logger,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

export const trpc = initTRPC.context<Context>().create();

const loggerMiddleware = trpc.middleware(async ({ ctx, next }) => {
  ctx.logger.info(`Request: - `);

  return next({
    ctx,
  });
});

const enforceUserIsAuthenticated = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.session.userId || !ctx.session.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx,
  });
});

export const publicProcedure = trpc.procedure.use(loggerMiddleware);
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthenticated);
