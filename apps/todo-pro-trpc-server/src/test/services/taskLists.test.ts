import { randomUUID } from 'crypto';
import { TaskListRepository } from '../../repositories/taskListRepo';
import { TaskListsService } from '../../services/taskLists';
import { UserRepository } from '../../repositories/userRepo';
import { UsersService } from '../../services/users';

describe('task list services', () => {
  const repo = new TaskListRepository();
  const service = new TaskListsService(repo);

  const userRepo = new UserRepository();
  const usersService = new UsersService(userRepo);

  it('creates a task list', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await service.createTaskList(user.userId, 'list title');

    expect(list.listId).not.toBeNull();
  });

  it('deletes a task list', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await service.createTaskList(user.userId, 'list title');

    await service.deleteTaskList(user.userId, list.listId);

    const updatedList = await service.findListById(user.userId, list.listId);

    expect(updatedList).toBeNull();
  });

  it('finds all task list for a user', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await service.createTaskList(user.userId, 'list title');

    expect(list.listId).not.toBeNull();

    const lists = await service.findAllListsByUserId(user.userId);

    expect(lists?.length).toBe(1);
  });

  it('finds a task list for an id', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await service.createTaskList(user.userId, 'list title');

    expect(list.listId).not.toBeNull();

    const newList = await service.findListById(user.userId, list.listId);

    expect(newList).not.toBeNull();
  });

  it('edits a task list', async () => {
    const userEmail = `${randomUUID()}@example.com`;
    const user = await usersService.createUser(userEmail, 'GOOGLE', '123456');

    const list = await service.createTaskList(user.userId, 'list title');

    expect(list.listId).not.toBeNull();

    await service.editTaskList(user.userId, list.listId, 'new title', 'desc');

    const newList = await service.findListById(user.userId, list.listId);

    expect(newList).not.toBeNull();
    expect(newList?.listTitle).toEqual('new title');
    expect(newList?.listDescription).toEqual('desc');
  });
});
