import React from 'react';
import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import LanguageDetector from 'i18next-browser-languagedetector';

import { enJSON } from '/@/locales/en';
import { deJSON } from '/@/locales/de';

import './styles/globals.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { AuthenticationContext } from './context/Authentication';
import { useAuthenticationStore } from './store';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    authenticationState: undefined!, // This will be set after we wrap the app in an AuthContext
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { ...enJSON },
      de: { ...deJSON },
    },
    fallbackLng: 'en', // Set the initial language of the App
  });

const AuthenticatedApp = () => {
  const authenticationState = useAuthenticationStore();

  return (
    <AuthenticationContext.Provider value={authenticationState}>
      <RouterProvider router={router} context={{ authenticationState }} />
    </AuthenticationContext.Provider>
  );
};

export const App: React.FC = () => {
  return (
    <React.StrictMode>
      <AuthenticatedApp />
    </React.StrictMode>
  );
};
