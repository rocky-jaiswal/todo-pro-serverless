import { createContext } from 'react';

import { type ThemeState, defaultThemeState } from '../../store';

export const ThemeContext = createContext<ThemeState>({
  ...defaultThemeState,
});
