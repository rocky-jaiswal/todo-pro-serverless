import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { Task, TaskList } from 'todo-pro-api/dist';
import { trpc } from '../api';

import { Loading } from '../components/Loading';
import { ListAndTasksContainer } from '../components/ListAndTasksContainer';
import { CreateTaskList } from '../components/CreateTaskList';
import { TopBar } from '../components/TopBar';

const Home = () => {
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const taskListQuery = useQuery<TaskList[]>(trpc.taskLists.getLists.queryOptions());

  if (!selectedList && taskListQuery.isSuccess) {
    if (taskListQuery.data[0]?.listId) {
      setSelectedList(taskListQuery.data[0].listId);
    }
  }

  const taskListDataQuery = useQuery<TaskList>(
    trpc.taskLists.getListDetails.queryOptions(
      {
        id: selectedList!,
      },
      { enabled: selectedList !== null },
    ),
  );

  const taskDataQuery = useQuery(
    trpc.taskLists.getTasksForList.queryOptions(
      {
        id: selectedList!,
      },
      { enabled: selectedList !== null },
    ),
  );

  if (taskListDataQuery.isError || taskDataQuery.isError || taskListQuery.isError) {
    return <span className="alert alert-error my-4">Error in fetching data! Please try again later.</span>;
  }

  if (taskListQuery.isSuccess && taskListQuery.data?.length === 0) {
    return (
      <>
        <p>You have no lists created. Why not create one now?</p>
        <CreateTaskList
          displayCreateListForm={true}
          onListsUpdate={taskListQuery.refetch}
          setSelectedList={setSelectedList}
        />
      </>
    );
  }

  if (
    taskListQuery.isLoading ||
    taskListDataQuery.isLoading ||
    taskDataQuery.isLoading ||
    !taskListQuery.data ||
    !taskListDataQuery.data ||
    !taskDataQuery.data
  ) {
    return <Loading />;
  }

  // console.log('---------------');
  // console.log(taskListQuery.data);
  // console.log(taskListDataQuery.data);
  // console.log(taskDataQuery.data);

  return (
    <div className="flex items-start justify-center">
      <div className="flex flex-col min-h-screen lg:w-9/12 max-w-7xl">
        <TopBar />
        <div className="flex h-full w-full grow flex-col lg:flex-row">
          <main role="main" className="flex grow flex-col p-6">
            <ListAndTasksContainer
              listData={taskListQuery.data}
              taskListData={taskListDataQuery.data}
              selectedList={selectedList!}
              taskData={taskDataQuery.data as Task[]}
              onListsUpdate={taskListQuery.refetch}
              onListUpdate={taskListDataQuery.refetch}
              onTasksUpdate={taskDataQuery.refetch}
              setSelectedList={setSelectedList}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/home')({
  component: Home,
});
