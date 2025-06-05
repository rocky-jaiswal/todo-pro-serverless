import { createContext } from 'react';

import { type AuthState, defaultAuthenticationState } from '../../store';

export const AuthenticationContext = createContext<AuthState>({
  ...defaultAuthenticationState,
});
