import { type Task as TaskType } from 'todo-pro-api/dist';
import { TaskCard } from '../TaskCard';

interface Props {
  taskData: TaskType[];
  onTasksUpdate: () => unknown;
}

export const TasksDisplay = (props: Props) => {
  return (
    <div className="flex flex-col">
      {props.taskData.map((task) => {
        return <TaskCard task={task} onTasksUpdate={props.onTasksUpdate} key={task.taskId} />;
      })}
    </div>
  );
};
