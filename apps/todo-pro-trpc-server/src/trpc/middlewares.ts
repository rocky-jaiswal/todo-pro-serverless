import { type JwtPayload } from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { JWToken } from '../services/token';

export const loggerMiddleware = (trpc: any) =>
  trpc.middleware(async ({ ctx, next }: any) => {
    ctx.logger.info(`Request: - `);

    return next({
      ctx,
    });
  });

export const enforceUserIsAuthenticated = (trpc: any) =>
  trpc.middleware(async ({ ctx, next }: any) => {
    if (!ctx.token || ctx.token.trim() === '') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      const payload = await new JWToken().validateToken(ctx.token);
      const userId = (payload as JwtPayload).sub;

      return next({
        ctx: {
          ...ctx,
          userId,
        },
      });
    } catch (err: unknown) {
      ctx.logger.error(err);
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'INVALID_AUTH_TOKEN' });
    }
  });
