import { trpc } from '../trpc';
import { healthRouter } from './health';
import { sessionsRouter } from './sessions';
import { taskListsRouter } from './taskLists';
import { tasksRouter } from './tasks';
import { usersRouter } from './users';

export const router = trpc.router({
  health: healthRouter,
  users: usersRouter,
  sessions: sessionsRouter,
  taskLists: taskListsRouter,
  tasks: tasksRouter,
});

export type AppRouter = typeof router;
