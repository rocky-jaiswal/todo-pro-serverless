import { randomUUID } from 'crypto';
import { Task } from '../entities/task';

export class TasksRepository {
  public async findAllTasksByUserAndList(userId: string, listId: string) {
    const tasks = await Task.query.task({ userId, listId }).go();
    return tasks.data;
  }

  public async findTaskById(userId: string, taskId: string) {
    const tasks = await Task.query.task({ userId, taskId }).go();
    return tasks.data;
  }

  public async createTask(userId: string, listId: string, title: string, createdOn: string, taskDueBy?: string) {
    const list = await Task.create({
      userId,
      listId,
      taskId: randomUUID(),
      taskTitle: title,
      createdOn,
      taskDueBy,
    }).go();

    return list.data;
  }

  public async deleteTask(userId: string, listId: string, taskId: string) {
    await Task.delete({ userId, listId, taskId }).go();
  }

  public async markAsCompleted(userId: string, listId: string, taskId: string) {
    await Task.patch({
      userId,
      listId,
      taskId,
    })
      .set({
        taskCompleted: true,
      })
      .go();
  }

  public async editTask(userId: string, listId: string, taskId: string, taskTitle: string, taskDueBy?: string) {
    await Task.patch({
      userId,
      listId,
      taskId,
    })
      .set({
        taskTitle,
        taskDueBy,
      })
      .go();
  }
}
