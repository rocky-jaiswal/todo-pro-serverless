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

  it('finds all tasks', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await listService.createTaskList(user.userId, 'list title');

    await tasksService.createTask(user.userId, list.listId, 'title 1');
    await tasksService.createTask(user.userId, list.listId, 'title 2');

    const found = await tasksService.findAllTasksByUserAndList(user.userId, list.listId);

    expect(found?.length).toEqual(2);
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

  it('cannot delete someone elses task', async () => {
    const userEmail1 = `${randomUUID()}@example.com`;
    const userEmail2 = `${randomUUID()}@example.com`;
    const user1 = await usersService.createUser(userEmail1, 'GOOGLE', '123456');
    const user2 = await usersService.createUser(userEmail2, 'GOOGLE', '123456');

    const list1 = await listService.createTaskList(user1.userId, 'list title');
    const list2 = await listService.createTaskList(user2.userId, 'list title');

    const task = await tasksService.createTask(user1.userId, list1.listId, 'title');

    expect(task).not.toBeNull();

    await tasksService.deleteTask(user2.userId, list2.listId, task.taskId);

    const found = await tasksService.findTaskById(user1.userId, task.taskId);

    expect(found).not.toBeNull();
    expect(found?.taskTitle).toEqual('title');
  });

  it('edits a task', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await listService.createTaskList(user.userId, 'list title');

    const task = await tasksService.createTask(user.userId, list.listId, 'title');

    expect(task).not.toBeNull();

    await tasksService.editTask(user.userId, list.listId, task.taskId, 'new title', '2026-01-01');

    const found = await tasksService.findTaskById(user.userId, task.taskId);

    expect(found).not.toBeNull();
    expect(found?.taskTitle).toEqual('new title');
    expect(found?.taskDueBy).toEqual('2026-01-01');
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
