import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, protectedProcedure } from '../trpc';
import { TaskListRepository } from '../repositories/taskListRepo';
import { TaskListsService } from '../services/taskLists';
import { TasksRepository } from '../repositories/taskRepo';
import { TasksService } from '../services/tasks';

export const taskListsRouter = trpc.router({
  getLists: protectedProcedure.query(async ({ ctx }) => {
    try {
      const repo = new TaskListRepository();
      const service = new TaskListsService(repo);

      const taskLists = await service.findAllListsByUserId(ctx.userId);

      return taskLists;
    } catch (err: unknown) {
      ctx.logger.error(err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  getListDetails: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const repo = new TaskListRepository();
        const service = new TaskListsService(repo);

        const taskList = await service.findListById(ctx.userId, input.id);

        return taskList;
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  getTasksForList: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const repo = new TasksRepository();
        const service = new TasksService(repo);

        const tasks = await service.findAllTasksByUserAndList(ctx.userId, input.id);

        return tasks;
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  createTaskList: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        description: z.string().max(150).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repo = new TaskListRepository();
        const service = new TaskListsService(repo);

        const taskList = await service.createTaskList(ctx.userId, input.name, input.description ?? undefined);

        return taskList;
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  deleteList: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repo = new TaskListRepository();
        const service = new TaskListsService(repo);

        await service.deleteTaskList(ctx.userId, input.listId);

        return {};
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
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
