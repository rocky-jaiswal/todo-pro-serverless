import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { trpc, protectedProcedure } from '../trpc';
import { TasksRepository } from '../repositories/taskRepo';
import { TasksService } from '../services/tasks';

export const tasksRouter = trpc.router({
  getTasksForList: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const repo = new TasksRepository();
        const service = new TasksService(repo);

        const taskList = await service.findAllTasksByUserAndList(ctx.userId, input.listId);

        return taskList;
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  createTask: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
        name: z.string().min(1).max(50),
        dueBy: z.string().date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repo = new TasksRepository();
        const service = new TasksService(repo);

        const task = await service.createTask(ctx.userId, input.listId, input.name, input.dueBy ?? undefined);

        return task;
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
        taskId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repo = new TasksRepository();
        const service = new TasksService(repo);

        await service.deleteTask(ctx.userId, input.listId, input.taskId);

        return {};
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  markAsCompleted: protectedProcedure
    .input(
      z.object({
        listId: z.string().uuid(),
        taskId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repo = new TasksRepository();
        const service = new TasksService(repo);

        const task = await service.markAsCompleted(ctx.userId, input.listId, input.taskId);

        return task;
      } catch (err: unknown) {
        ctx.logger.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
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
