import { z } from 'zod';

import { trpc, protectedProcedure } from '../trpc';

export const tasksRouter = trpc.router({
  createTask: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        description: z.string().max(150).nullable(),
        dueBy: z.string().date().nullable(),
        listId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  markAsCompleted: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(50),
        description: z.string().max(150).nullable(),
        dueBy: z.string().date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
});
