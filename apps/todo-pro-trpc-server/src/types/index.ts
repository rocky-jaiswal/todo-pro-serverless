export type TaskList = {
  id: string;
  name: string;
  description: string | null;
};

export type Task = {
  id: string;
  name: string;
  description: string | null;
  completed: boolean;
  dueBy: Date | null;
};
