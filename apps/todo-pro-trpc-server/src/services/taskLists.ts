import { formatISO } from 'date-fns';
import { TaskListRepository } from '../repositories/taskListRepo';
import { TaskList } from '../types';

export class TaskListsService {
  private readonly taskListRepo: TaskListRepository;

  constructor(taskListRepo: TaskListRepository) {
    this.taskListRepo = taskListRepo;
  }

  public async findAllListsByUserId(userId: string): Promise<TaskList[]> {
    const lists = await this.taskListRepo.findAllListsByUserId(userId);
    return lists.map(this.toDTO);
  }

  public async findListById(userId: string, listId: string): Promise<TaskList | null> {
    const list = await this.taskListRepo.findListById(userId, listId);

    return list[0] ? this.toDTO(list[0]) : null;
  }

  public async createTaskList(userId: string, title: string, description?: string): Promise<TaskList> {
    const list = await this.taskListRepo.createTaskList(userId, title, formatISO(new Date()), description);
    return this.toDTO(list);
  }

  public async deleteTaskList(userId: string, listId: string) {
    const list = await this.findListById(userId, listId);

    if (list) {
      await this.taskListRepo.deleteTaskList(userId, listId);
    }
  }

  public async editTaskList(userId: string, listId: string, title: string, description?: string) {
    const list = await this.findListById(userId, listId);

    if (list) {
      await this.taskListRepo.editTaskList(userId, listId, title, description);
    }

    return this.findListById(userId, listId);
  }

  private toDTO(taskList: any): TaskList {
    return {
      listId: taskList.listId,
      listTitle: taskList.listTitle,
      listDescription: taskList.listDescription,
    };
  }
}
