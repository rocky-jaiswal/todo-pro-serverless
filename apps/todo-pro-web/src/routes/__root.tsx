import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { QueryClientProvider } from '@tanstack/react-query';

import { AuthenticationContext } from '../context/Authentication';
import { LocaleContext } from '../context/Locale';
import { ThemeContext } from '../context/Themes';

import { ErrorDisplay } from '../components/ErrorDisplay';

import { queryClient } from '../api';
import { useThemeStore, useAuthenticationStore, useLocaleStore } from '../store';

const Root: React.FC = () => {
  const themeState = useThemeStore();
  const authenticationState = useAuthenticationStore();
  const localeState = useLocaleStore();

  return (
    <div data-theme={themeState.currentTheme} className="v-screen flex h-screen min-h-full min-w-full flex-col">
      <AuthenticationContext.Provider value={authenticationState}>
        <ThemeContext.Provider value={themeState}>
          <LocaleContext.Provider value={localeState}>
            <QueryClientProvider client={queryClient}>
              <div className="flex flex-col container mx-auto px-4">
                <Outlet />
              </div>
            </QueryClientProvider>
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </AuthenticationContext.Provider>
      {/* <TanStackRouterDevtools /> */}
    </div>
  );
};

export const Route = createRootRoute({
  component: Root,
  errorComponent: ErrorDisplay,
});
