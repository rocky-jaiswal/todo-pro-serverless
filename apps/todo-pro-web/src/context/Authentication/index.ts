import { createContext } from 'react';

import { AuthState, defaultAuthenticationState } from '/@/store';

export const AuthenticationContext = createContext<AuthState>({
  ...defaultAuthenticationState,
});
