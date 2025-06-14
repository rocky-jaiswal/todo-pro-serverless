import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type ActionTypes = 'SIGNIN' | 'SIGNOUT';

interface Actions {
  type: ActionTypes;
  payload?: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  dispatch: (args: Actions) => void;
}

export const defaultAuthenticationState: AuthState = {
  token: null,
  isAuthenticated: false,
  dispatch: (_args: Actions) => {}, // dummy function
};

const reducer = (state: AuthState, { type, payload }: Actions) => {
  // console.log({ state, type, payload });
  switch (type) {
    case 'SIGNIN':
      return { ...state, isAuthenticated: true, token: payload };
    case 'SIGNOUT':
      return { ...state, isAuthenticated: false, token: null };
    default:
      return state;
  }
};

export const useAuthenticationStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: defaultAuthenticationState.token,
        isAuthenticated: defaultAuthenticationState.isAuthenticated,
        dispatch: (args: Actions) => set((state: AuthState) => reducer(state, args)),
      }),
      {
        name: 'authentication-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
