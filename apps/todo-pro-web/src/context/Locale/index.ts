import { createContext } from 'react';

import { LocaleState, defaultLocaleState } from '/@/store';

export const LocaleContext = createContext<LocaleState>({
  ...defaultLocaleState,
});
