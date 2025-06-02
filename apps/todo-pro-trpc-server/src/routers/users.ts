import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, publicProcedure } from '../trpc';
import { GoogleOAuthClient } from '../services/googleOAuthClient';

export const usersRouter = trpc.router({
  createGoogleUser: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // ctx.logger.info('------createGoogleUser------->');

        const googleOAuthClient = new GoogleOAuthClient();
        const email = await googleOAuthClient.getEmailFromAuthCode(input.code);

        // TODO: Create or get auth token by user email
        return email;
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
