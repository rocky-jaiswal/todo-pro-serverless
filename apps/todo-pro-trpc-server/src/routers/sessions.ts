import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, publicProcedure } from '../trpc';
import { GoogleOAuthClient } from '../services/googleOAuthClient';
import { SessionsService } from '../services/sessions';

export const sessionsRouter = trpc.router({
  createSession: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionsService = new SessionsService();
        const jwt = sessionsService.validateLogin(input.email, input.password);

        return jwt;
      } catch (err) {
        ctx.logger.error(err);

        if ((err as Error).message === 'UNAUTHORIZED') {
          throw err;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          cause: err,
        });
      }
    }),
  getGoogleUrl: publicProcedure.query(async ({ ctx }) => {
    try {
      const googleOAuthClient = new GoogleOAuthClient();

      return googleOAuthClient.generateAuthUrl();
    } catch (err) {
      ctx.logger.error(err);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred, please try again later.',
        cause: err,
      });
    }
  }),
});
