import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, publicProcedure, protectedProcedure } from '../trpc';
import { GoogleOAuthClient } from '../services/googleOAuthClient';
import { UserRepository } from '../repositories/userRepo';
import { UsersService } from '../services/users';
import { SessionsService } from '../services/sessions';
import { JWToken } from '../services/token';

export const usersRouter = trpc.router({
  createGoogleUser: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const googleOAuthClient = new GoogleOAuthClient();
        const email = await googleOAuthClient.getEmailFromAuthCode(input.code);

        const userRepo = new UserRepository();
        const usersService = new UsersService(userRepo);
        const sessionsService = new SessionsService();

        const user = await usersService.findOrCreateUser(email.email, 'GOOGLE');
        const jwt = await sessionsService.createSession(user.userId);

        return jwt;
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
      if (input.password !== input.confirmedPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Bad request for create user',
        });
      }

      try {
        const userRepo = new UserRepository();
        const usersService = new UsersService(userRepo);
        const sessionsService = new SessionsService();

        const encryptedPassword = await sessionsService.encryptPassword(input.password);
        const user = await usersService.findOrCreateUser(input.email, 'PASSWORD', encryptedPassword);
        const jwt = await sessionsService.createSession(user.userId);

        return jwt;
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
    try {
      const userRepo = new UserRepository();
      const usersService = new UsersService(userRepo);

      const payload = await new JWToken().validateToken(ctx.token!);
      const user = await usersService.findUserById(payload.sub!);

      return { email: user.email };
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
