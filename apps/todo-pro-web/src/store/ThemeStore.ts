import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export interface ThemeState {
  allThemes: string[];
  currentTheme: string;
}

export const defaultThemeState: ThemeState = {
  allThemes: ['light', 'dark'],
  currentTheme: 'dark',
};

type ActionTypes = 'CHANGE_THEME';

interface Actions {
  type: ActionTypes;
  payload?: unknown;
}

const reducer = (state: ThemeState, { type }: Actions) => {
  switch (type) {
    case 'CHANGE_THEME':
      return {
        ...state,
        currentTheme: state.currentTheme === state.allThemes[0] ? state.allThemes[1] : state.allThemes[0],
      };
    default:
      return state;
  }
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (_set) => ({
        allThemes: defaultThemeState.allThemes,
        currentTheme: defaultThemeState.currentTheme,
      }),
      {
        name: 'theme-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export const dispatchForThemeStore = (args: Actions) =>
  useThemeStore.setState((state: ThemeState) => reducer(state, args));
