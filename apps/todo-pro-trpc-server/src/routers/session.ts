import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, publicProcedure } from '../trpc';
import { GoogleOAuthClient } from '../services/googleOAuthClient';

export const sessionsRouter = trpc.router({
  createSession: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info(JSON.stringify({ input }));

      return {};
    }),

  getGoogleUrl: publicProcedure.query(async ({ ctx }) => {
    try {
      // ctx.logger.info('------------->');
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
