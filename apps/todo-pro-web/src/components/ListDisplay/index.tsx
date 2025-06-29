import * as React from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { type TaskList } from 'todo-pro-api/dist';
import { createClient } from '../../api';
import { EditTaskList } from '../EditTaskList';

interface Props {
  listId: string;
  taskListData: TaskList;
  onListUpdate: () => unknown;
  onListsUpdate: () => unknown;
  setSelectedList: (listId: string | null) => unknown;
}

export const ListDisplay = (props: Props) => {
  const trpc = createClient();

  const [displayEditForm, setDisplayEditForm] = useState<boolean>(false);
  const deleteListMutation = useMutation<TaskList, unknown, Record<string, string | null>>(
    trpc.taskLists.deleteList.mutationOptions(),
  );
  const detailsRef = React.useRef<HTMLDetailsElement | null>(null);

  if (displayEditForm) {
    return (
      <EditTaskList
        listId={props.listId}
        listName={props.taskListData.listTitle || ''}
        listDescription={props.taskListData.listDescription || ''}
        setEditListFormDisplay={setDisplayEditForm}
        onListUpdate={props.onListUpdate}
        onListsUpdate={props.onListsUpdate}
      />
    );
  }

  return (
    <div className="flex flex-row justify-between items-baseline border rounded-md p-4 my-4">
      <div className="flex flex-row items-center">
        <h1 className="text-3xl font-bold py-5 text-blue-500">{props.taskListData.listTitle || ''}</h1>
        <p className="badge badge-ghost px-4">{props.taskListData.listDescription || ''}</p>
      </div>
      <div>
        <details className="dropdown dropdown-end" ref={detailsRef}>
          <summary className="btn m-1">
            <img src="/dots.png" width={20} height={20} alt="actions" />
          </summary>
          <ul className="menu dropdown-content bg-[#2f3389] rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <button onClick={() => setDisplayEditForm(true)}>Edit</button>
            </li>
            <li>
              <button
                disabled={deleteListMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  detailsRef.current && detailsRef.current.removeAttribute('open');
                  deleteListMutation
                    .mutateAsync({
                      listId: props.taskListData.listId,
                    })
                    .then(() => {
                      props.onListsUpdate();
                      props.setSelectedList(null);
                    })
                    .catch((err: unknown) => console.error(err)); // TODO: Handle this error
                }}
              >
                Delete
              </button>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
};
