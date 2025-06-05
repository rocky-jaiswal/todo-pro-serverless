import { type AppRouter, type Task, type TaskList } from 'todo-pro-trpc-server/dist';

export const hello = () => console.log('hello');

export { type AppRouter };
export { type TaskList };
export { type Task };
