import { trpc } from '../trpc';
import { healthRouter } from './health';
import { sessionsRouter } from './session';
import { usersRouter } from './users';

export const router = trpc.router({
  health: healthRouter,
  sessions: sessionsRouter,
  users: usersRouter,
  // home: homeRouter,
  // taskList: taskListRouter,
  // task: taskRouter,
});

export type AppRouter = typeof router;
