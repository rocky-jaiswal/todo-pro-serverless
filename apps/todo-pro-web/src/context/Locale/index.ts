import { createContext } from 'react';

import { type LocaleState, defaultLocaleState } from '../../store';

export const LocaleContext = createContext<LocaleState>({
  ...defaultLocaleState,
});
