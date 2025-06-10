export type User = {
  id: string;
  email: string;
  password?: string;
  loginType?: string;
};

export type TaskList = {
  listId: string;
  listTitle: string;
  listDescription?: string;
};

export type Task = {
  taskId: string;
  listId: string;
  taskTitle: string;
  taskDueBy?: string;
  taskCompleted?: boolean;
};
