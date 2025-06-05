import { trpc } from '../trpc';
import { healthRouter } from './health';
import { homeRouter } from './home';
import { sessionsRouter } from './sessions';
import { taskListsRouter } from './taskLists';
import { tasksRouter } from './tasks';
import { usersRouter } from './users';

export const router = trpc.router({
  health: healthRouter,
  sessions: sessionsRouter,
  users: usersRouter,
  home: homeRouter,
  taskLists: taskListsRouter,
  tasks: tasksRouter,
});

export type AppRouter = typeof router;
