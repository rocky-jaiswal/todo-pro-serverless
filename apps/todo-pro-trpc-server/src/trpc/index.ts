import pino from 'pino';

import { type CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { type APIGatewayProxyEvent } from 'aws-lambda';
import { type JwtPayload } from 'jsonwebtoken';
import { initTRPC, TRPCError } from '@trpc/server';

import { JWToken } from '../services/token';

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

const loggerMiddleware = trpc.middleware(async ({ ctx, next }) => {
  ctx.logger.info(`Request: - `);

  return next({
    ctx,
  });
});

const enforceUserIsAuthenticated = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.token || ctx.token.trim() === '') {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  try {
    const jwt = new JWToken();
    const payload = await jwt.validateToken(ctx.token);

    const userId = (payload as JwtPayload).sub;

    return next({
      ctx: {
        ...ctx,
        userId,
      },
    });
  } catch (err: unknown) {
    ctx.logger.error(err);
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
});

export const publicProcedure = trpc.procedure.use(loggerMiddleware);
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthenticated);
