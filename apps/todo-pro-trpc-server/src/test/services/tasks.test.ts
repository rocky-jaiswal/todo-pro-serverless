import { randomUUID } from 'crypto';
import { TaskListRepository } from '../../repositories/taskListRepo';
import { TaskListsService } from '../../services/taskLists';
import { UserRepository } from '../../repositories/userRepo';
import { UsersService } from '../../services/users';
import { TasksRepository } from '../../repositories/taskRepo';
import { TasksService } from '../../services/tasks';

describe('task list services', () => {
  const userRepo = new UserRepository();
  const usersService = new UsersService(userRepo);

  const listRepo = new TaskListRepository();
  const listService = new TaskListsService(listRepo);

  const taskRepo = new TasksRepository();
  const tasksService = new TasksService(taskRepo);

  it('creates a task', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await listService.createTaskList(user.userId, 'list title');

    const task = await tasksService.createTask(user.userId, list.listId, 'title');

    expect(task).not.toBeNull();

    const found = await tasksService.findTaskById(user.userId, task.taskId);

    expect(found?.taskTitle).toEqual('title');
  });

  it('finds a task', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await listService.createTaskList(user.userId, 'list title');

    const task = await tasksService.createTask(user.userId, list.listId, 'title');

    expect(task).not.toBeNull();

    const found = await tasksService.findAllTasksByUserAndList(user.userId, list.listId);

    expect(found?.length).toEqual(1);
  });

  it('deletes a task', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await listService.createTaskList(user.userId, 'list title');

    const task = await tasksService.createTask(user.userId, list.listId, 'title');

    expect(task).not.toBeNull();

    await tasksService.deleteTask(user.userId, list.listId, task.taskId);

    const found = await tasksService.findTaskById(user.userId, task.taskId);

    expect(found).toBeNull();
  });

  it('marks a task as completed', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await listService.createTaskList(user.userId, 'list title');

    const task = await tasksService.createTask(user.userId, list.listId, 'title');

    expect(task).not.toBeNull();

    await tasksService.markAsCompleted(user.userId, list.listId, task.taskId);

    const found = await tasksService.findTaskById(user.userId, task.taskId);

    expect(found).not.toBeNull();
    expect(found?.taskCompleted).toBeTruthy();
  });
});
