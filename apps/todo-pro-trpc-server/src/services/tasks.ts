import { formatISO } from 'date-fns';
import { TasksRepository } from '../repositories/taskRepo';
import { Task } from '../types';

export class TasksService {
  private readonly tasksRepository: TasksRepository;

  constructor(taskListRepo: TasksRepository) {
    this.tasksRepository = taskListRepo;
  }

  public async findAllTasksByUserAndList(userId: string, listId: string): Promise<Task[]> {
    const tasks = await this.tasksRepository.findAllTasksByUserAndList(userId, listId);

    return tasks.map(this.toDTO);
  }

  public async findTaskById(userId: string, taskId: string) {
    const task = await this.tasksRepository.findTaskById(userId, taskId);

    return task[0] ? this.toDTO(task[0]) : null;
  }

  public async createTask(userId: string, listId: string, title: string, dueBy?: string) {
    const task = await this.tasksRepository.createTask(userId, listId, title, formatISO(new Date()), dueBy);

    return this.toDTO(task);
  }

  // public async editTask(taskId: string, name: string, description?: string, dueBy?: string) {}

  public async markAsCompleted(userId: string, listId: string, taskId: string) {
    const task = await this.findTaskById(userId, taskId);

    if (task) {
      await this.tasksRepository.markAsCompleted(userId, listId, taskId);
    }

    return this.findTaskById(userId, taskId);
  }

  public async deleteTask(userId: string, listId: string, taskId: string) {
    const task = await this.findTaskById(userId, taskId);
    if (task) {
      await this.tasksRepository.deleteTask(userId, listId, taskId);
    }
  }

  private toDTO(task: any): Task {
    return {
      taskId: task.taskId,
      listId: task.listId,
      taskTitle: task.taskTitle,
      taskCompleted: task.taskCompleted,
      taskDueBy: task.taskDueBy,
    };
  }
}
