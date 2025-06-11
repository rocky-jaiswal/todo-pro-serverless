import * as React from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { differenceInCalendarDays, endOfToday, isBefore, isToday, parse } from 'date-fns';
import { type Task } from 'todo-pro-api/dist';

import { createClient } from '../../api';
import { EditTask } from '../EditTask';

interface Props {
  task: Task;
  onTasksUpdate: () => unknown;
}

const toDate = (str: string) => parse(str, 'yyyy-MM-dd', new Date());

const isOverdue = (dueBy?: string) => dueBy && isBefore(toDate(dueBy), endOfToday()) && !isToday(dueBy);

const isDueToday = (dueBy?: string) => dueBy && isToday(toDate(dueBy));

const daysDiff = (dueBy: string) => {
  const diff = Math.abs(differenceInCalendarDays(toDate(dueBy), endOfToday()));
  return diff === 1 ? `${diff} day` : `${diff} days`;
};

export const TaskCard = (props: Props) => {
  const trpc = createClient();

  const [displayEditForm, setDisplayEditForm] = useState<boolean>(false);

  const deleteTaskMutation = useMutation<Task, unknown, Record<string, string | null>>(
    trpc.tasks.deleteTask.mutationOptions(),
  );
  const markDoneMutation = useMutation<Task, unknown, Record<string, string | null>>(
    trpc.tasks.markAsCompleted.mutationOptions(),
  );

  const { task } = props;
  const taskRef = React.useRef<HTMLDetailsElement | null>(null);

  if (displayEditForm) {
    return <EditTask task={task} setDisplayEditForm={setDisplayEditForm} onTasksUpdate={props.onTasksUpdate} />;
  }

  return (
    <div
      className={`flex flex-row justify-between 
              border border-secondary rounded-md 
              px-4 py-1 my-1 
              ${!task.taskCompleted && isOverdue(task.taskDueBy) ? 'bg-error' : ''} 
              ${!task.taskCompleted && isDueToday(task.taskDueBy) ? 'bg-warning' : ''}
              ${task.taskCompleted ? 'bg-[#769e6b]' : ''}
            `}
    >
      <div className={`flex items-center justify-between w-full px-2 ${task.taskCompleted ? 'line-through' : ''}`}>
        <div>{task.taskTitle}</div>
        <div className={task.taskDueBy && !task.taskCompleted ? 'text-sm italic' : 'hidden'}>
          {task.taskDueBy
            ? isOverdue(task.taskDueBy)
              ? `Overdue by ${daysDiff(task.taskDueBy)}`
              : isDueToday(task.taskDueBy)
                ? 'Due today'
                : `Due in ${daysDiff(task.taskDueBy)}`
            : ''}
        </div>
      </div>
      <div>
        <details className="dropdown dropdown-end" ref={taskRef}>
          <summary className="btn m-1">
            <img src="/dots.png" width={20} height={20} alt="actions" />
          </summary>
          <ul className="menu dropdown-content bg-[#2f3389] rounded-box z-[1] w-52 p-2 shadow">
            <li style={task.taskCompleted ? { display: 'none' } : {}}>
              <button
                disabled={task.taskCompleted || markDoneMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  taskRef.current && taskRef.current.removeAttribute('open');
                  markDoneMutation
                    .mutateAsync({
                      listId: task.listId,
                      taskId: task.taskId,
                    })
                    .then(() => props.onTasksUpdate())
                    .catch((err: unknown) => console.error(err)); // TODO: Handle this error
                }}
              >
                Mark done
              </button>
            </li>
            <li>
              <button onClick={() => setDisplayEditForm(true)}>Edit</button>
            </li>
            <li>
              <button
                disabled={deleteTaskMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  taskRef.current && taskRef.current.removeAttribute('open');
                  deleteTaskMutation
                    .mutateAsync({
                      taskId: task.taskId,
                      listId: task.listId,
                    })
                    .then(() => props.onTasksUpdate())
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
