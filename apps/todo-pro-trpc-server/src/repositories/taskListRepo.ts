import { randomUUID } from 'crypto';
import { TaskList } from '../entities/taskList';

export class TaskListRepository {
  public async findAllListsByUserId(userId: string) {
    const lists = await TaskList.query.taskList({ userId }).go();
    return lists.data;
  }

  public async findListById(userId: string, listId: string) {
    const lists = await TaskList.query.taskList({ userId, listId }).go();
    return lists.data;
  }

  public async createTaskList(userId: string, title: string, createdOn: string, description?: string) {
    const list = await TaskList.create({
      userId,
      listId: randomUUID(),
      listTitle: title,
      createdOn,
      listDescription: description,
    }).go();

    return list.data;
  }

  public async deleteTaskList(userId: string, listId: string) {
    await TaskList.delete({ userId, listId }).go();
  }

  public async editTaskList(userId: string, listId: string, title: string, description?: string) {
    await TaskList.patch({
      userId,
      listId,
    })
      .set({
        listTitle: title,
        listDescription: description,
      })
      .go();
  }
}
