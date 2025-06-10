import { type Task as TaskType } from 'todo-pro-api/dist';
import { type TaskList as TaskListType } from 'todo-pro-api/dist';
import { CreateTask } from '../CreateTask';
import { ListDisplay } from '../ListDisplay';
import { TasksDisplay } from '../TasksDisplay';

interface Props {
  taskListData: TaskListType;
  taskData?: TaskType[];
  onTasksUpdate: () => unknown;
  onListUpdate: () => unknown;
  onListsUpdate: () => unknown;
  setSelectedList: (listId: string | null) => unknown;
}

export const TaskListWithTaskIndex = (props: Props) => {
  return (
    <div>
      <ListDisplay
        listId={props.taskListData.listId}
        taskListData={props.taskListData}
        onListUpdate={props.onListUpdate}
        onListsUpdate={props.onListsUpdate}
        setSelectedList={props.setSelectedList}
      />
      <TasksDisplay taskData={props.taskData ?? []} onTasksUpdate={props.onTasksUpdate} />
      <div className="my-8" />
      <CreateTask listId={props.taskListData.listId} onTasksUpdate={props.onTasksUpdate} />
      <div />
    </div>
  );
};
