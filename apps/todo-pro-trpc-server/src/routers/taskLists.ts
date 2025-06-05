import { z } from 'zod';

import { trpc, protectedProcedure } from '../trpc';

export const taskListsRouter = trpc.router({
  createTaskList: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        description: z.string().max(150).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  getListDetails: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  getTasksForList: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  deleteList: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
  editList: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
        name: z.string().min(1).max(50),
        description: z.string().max(150).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ ctx, input });

      return {};
    }),
});
