import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { type TaskList } from 'todo-pro-api/dist';

import { createClient } from '../../api';

interface Props {
  displayCreateListForm: boolean;
  onListsUpdate: () => unknown;
  setSelectedList: (listId: string) => unknown;
  // setCreateListFormDisplay: (_: boolean) => unknown
}

export const CreateTaskList = (props: Props) => {
  const trpc = createClient();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const createTaskListMutation = useMutation<TaskList, unknown, Record<string, string | null>>(
    trpc.taskLists.createTaskList.mutationOptions(),
  );

  if (!props.displayCreateListForm) {
    return <div />;
  }

  return (
    <div className="flex flex-col max-w-96 my-6">
      <form method="post">
        <label className="input input-bordered flex items-center gap-2 py-2 my-2">
          Name:
          <input type="text" placeholder="Name" required={true} onChange={(e) => setName(e.currentTarget.value)} />
        </label>
        <label className="input input-bordered flex items-center gap-2 py-2 my-2">
          Description:
          <input type="text" placeholder="Description" onChange={(e) => setDescription(e.currentTarget.value)} />
        </label>
        <button
          className="btn btn-primary p-2 my-4"
          type="submit"
          disabled={!name || createTaskListMutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            createTaskListMutation
              .mutateAsync({
                name,
                description,
              })
              .then((_response: unknown) => {
                // props.setCreateListFormDisplay(false)
                props.onListsUpdate();
                // props.setSelectedList(response.id);
              })
              .catch((err: unknown) => console.error(err)); // TODO: Handle this error
          }}
        >
          Create List
        </button>
      </form>
    </div>
  );
};
