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

    return this.toDTO(task[0]);
  }

  public async createTask(userId: string, listId: string, title: string, dueBy?: string) {
    const task = await this.tasksRepository.createTask(userId, listId, title, formatISO(new Date()), dueBy);

    return this.toDTO(task);
  }

  // public async editTask(taskId: string, name: string, description?: string, dueBy?: string) {}

  // public async markTaskAsCompleted(taskId: string) {}

  // public async deleteTask(taskId: string) {}

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
