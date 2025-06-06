import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, publicProcedure, protectedProcedure } from '../trpc';
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
        ctx.logger.info('------createGoogleUser------->');

        const googleOAuthClient = new GoogleOAuthClient();
        const email = await googleOAuthClient.getEmailFromAuthCode(input.code);

        // TODO: Find or create user by email
        // TODOD: Create or get auth token by user id
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
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        confirmedPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        ctx.logger.info({ input });
        return {};
      } catch (err) {
        ctx.logger.error(err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          cause: err,
        });
      }
    }),
  userDetails: protectedProcedure.query(async ({ ctx }) => {
    ctx.logger.info('--->');
    return {};
  }),
});
