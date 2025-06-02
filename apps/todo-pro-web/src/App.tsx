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

// Create a new router instance
const router = createRouter({ routeTree });

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

export const App: React.FC = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};
