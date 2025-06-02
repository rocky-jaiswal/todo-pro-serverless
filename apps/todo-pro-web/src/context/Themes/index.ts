import { createContext } from 'react';

import { ThemeState, defaultThemeState } from '/@/store';

export const ThemeContext = createContext<ThemeState>({
  ...defaultThemeState,
});
