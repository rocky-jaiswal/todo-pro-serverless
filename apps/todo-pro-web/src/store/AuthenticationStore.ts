import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type ActionTypes = 'SIGNIN' | 'SIGNOUT';

interface Actions {
  type: ActionTypes;
  payload?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
}

export interface AuthActions {
  dispatch: (args: Actions) => void;
}

export const defaultAuthenticationState: AuthState = {
  isAuthenticated: false,
};

const reducer = (state: AuthState, { type }: Actions) => {
  // console.log({ state, type, payload });
  switch (type) {
    case 'SIGNIN':
      return { ...state, isAuthenticated: true };
    case 'SIGNOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

export const useAuthenticationStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: defaultAuthenticationState.isAuthenticated,
        dispatch: (args: Actions) => set((state: AuthState & AuthActions) => reducer(state, args)),
      }),
      {
        name: 'authentication-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
