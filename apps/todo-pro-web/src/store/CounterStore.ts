import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface CountState {
  count: number;
}

type ActionTypes = 'INCREASE' | 'DECREASE';

interface Actions {
  type: ActionTypes;
  payload?: unknown;
}

const reducer = (state: CountState, { type }: Actions) => {
  switch (type) {
    case 'INCREASE':
      return { count: state.count + 1 };
    case 'DECREASE':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

export const useCountStore = create<CountState>()(
  devtools(
    persist(
      (_set) => ({
        count: 0, // default value
      }),
      {
        name: 'count-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export const dispatchForCountStore = (args: Actions) =>
  useCountStore.setState((state: CountState) => reducer(state, args));
