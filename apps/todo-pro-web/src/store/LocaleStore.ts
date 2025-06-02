import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface LocaleState {
  locale: string;
  currentLanguage: string;
}

export const defaultLocaleState: LocaleState = {
  locale: 'en-EN',
  currentLanguage: 'en',
};

type ActionTypes = 'CHANGE_LANGUAGE';

interface Actions {
  type: ActionTypes;
  payload?: unknown;
}

const reducer = (state: LocaleState, { type }: Actions) => {
  switch (type) {
    case 'CHANGE_LANGUAGE':
      return {
        ...state,
        locale: state.locale === 'en-EN' ? 'de-DE' : 'en-EN',
        currentLanguage: state.currentLanguage === 'en' ? 'de' : 'en',
      };
    default:
      return state;
  }
};

export const useLocaleStore = create<LocaleState>()(
  devtools((_set) => ({
    locale: defaultLocaleState.locale,
    currentLanguage: defaultLocaleState.currentLanguage,
  })),
);

export const dispatchForLocaleStore = (args: Actions) =>
  useLocaleStore.setState((state: LocaleState) => reducer(state, args));
