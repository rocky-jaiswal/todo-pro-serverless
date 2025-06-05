import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '../api';

import { Loading } from '../components/Loading';
import { ListAndTasksContainer } from '../components/ListAndTasksContainer';
import { CreateTaskList } from '../components/CreateTaskList';
import { createFileRoute } from '@tanstack/react-router';

const Home = () => {
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const taskListQuery = useQuery(trpc.home.findUserAndLists.queryOptions());

  if (!selectedList && taskListQuery.isSuccess) {
    // console.log(selectedList)
    // TODO: Fix me
    // if (taskListQuery.data[0]?.id) {
    //   setSelectedList(taskListQuery.data[0].id);
    // }
  }

  const taskListDataQuery = useQuery(
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

  return (
    <ListAndTasksContainer
      listData={taskListQuery.data()}
      taskListData={taskListDataQuery.data()}
      selectedList={selectedList!}
      taskData={taskDataQuery.data()}
      onListsUpdate={taskListQuery.refetch}
      onListUpdate={taskListDataQuery.refetch}
      onTasksUpdate={taskDataQuery.refetch}
      setSelectedList={setSelectedList}
    />
  );
};

export const Route = createFileRoute('/home')({
  component: Home,
});
