import { useState } from 'react';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { type Task } from 'todo-pro-api/dist';

import { createClient } from '../../api';

interface Props {
  task: Task;
  onTasksUpdate: () => unknown;
  setDisplayEditForm: (display: boolean) => unknown;
}

export const EditTask = (props: Props) => {
  const trpc = createClient();

  const [name, setName] = useState<string>(props.task.taskTitle);
  const [dueBy, setDueDate] = useState<string | null>(
    props.task.taskDueBy ? format(props.task.taskDueBy, 'yyyy-MM-dd') : null,
  );

  const updateTaskMutation = useMutation<Task, unknown, Record<string, string | null>>(
    trpc.tasks.updateTask.mutationOptions(),
  );

  return (
    <div className="flex flex-col items-end">
      <form method="post">
        <label className="input input-bordered flex items-center gap-2 py-2 my-2">
          Name:
          <input
            type="text"
            placeholder="Name"
            required={true}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 py-2 my-2">
          Due By:
          <input
            type="date"
            placeholder="Due Date"
            value={dueBy || ''}
            onChange={(e) => setDueDate(e.currentTarget.value)}
          />
        </label>
        <div className="flex justify-end p-2 my-4">
          <button
            className="btn btn-success"
            type="submit"
            disabled={!name || updateTaskMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              props.setDisplayEditForm(false);
              updateTaskMutation
                .mutateAsync({
                  taskId: props.task.taskId,
                  listId: props.task.listId,
                  name,
                  dueBy,
                })
                .then(() => {
                  props.onTasksUpdate();
                })
                .catch((err: unknown) => console.error(err)); // TODO: Handle this error
            }}
          >
            {updateTaskMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : 'Update Todo'}
          </button>
          <button className="btn btn-outline btn-ghost ml-4" onClick={() => props.setDisplayEditForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
