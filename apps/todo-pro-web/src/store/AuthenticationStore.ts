import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export interface AuthState {
  jsonToken: string | null;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

type ActionTypes = 'SIGNIN' | 'SIGNOUT';

interface Actions {
  type: ActionTypes;
  payload?: unknown;
}

export const defaultAuthenticationState: AuthState = {
  jsonToken: null,
  isAuthenticated: false,
  signIn: () => {
    console.log('not invoked');
  },
  signOut: () => {
    console.log('not invoked 2');
  },
};

const reducer = (state: AuthState, { type }: Actions) => {
  switch (type) {
    case 'SIGNIN':
      return { ...state, isAuthenticated: true };
    case 'SIGNOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

export const useAuthenticationStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        jsonToken: defaultAuthenticationState.jsonToken,
        isAuthenticated: false,
        signIn: () =>
          set((_state) => ({
            jsonToken: 'dummy',
            isAuthenticated: true,
          })),
        signOut: () =>
          set((_state) => ({
            jsonToken: null,
            isAuthenticated: false,
          })),
      }),
      {
        name: 'authentication-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export const dispatchForAuthenticationStore = (args: Actions) =>
  useAuthenticationStore.setState((state: AuthState) => reducer(state, args));
