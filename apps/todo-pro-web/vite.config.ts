import type { ConfigEnv } from 'vite';
import { defineConfig } from 'vite';

import fs from 'fs';
import { resolve } from 'path'; // dotenv is a "zero-dependent" module that extracts variables in the env variable from the '.env.xxx' file.

import dotenv from 'dotenv';
import React from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

/**
 * https://vitejs.dev/config/
 */
const baseConfig = {
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    React(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'To-do Pro',
        short_name: 'To-do Pro',
        description: 'To-do Pro',
        theme_color: '#1d232a',
        icons: [
          {
            src: 'favicons/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'favicons/pwa-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'favicons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'favicons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'favicons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'screenshot-512.png', // add desktop sreenshot
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'To-do Pro',
          },
          {
            src: 'screenshot-512.png', // add mobile screenshot
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'To-do Pro',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: '/@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
};

interface ENV {
  [K: string]: string;
}

const getEnv = (mode: string) => {
  const envFileName = `.env.${mode}`;
  const envObject = Object.create(null) as ENV;

  try {
    const envConfig = dotenv.parse(fs.readFileSync(envFileName));
    for (const k in envConfig) Object.assign(envObject, { [k]: envConfig[k] });
    return envObject;
  } catch (error) {
    console.error(error);
    return envObject;
  }
};

export default ({ mode, command }: ConfigEnv) => {
  /**
   * Such as:
   * import.meta.env.MODE: {string}
   * import.meta.env.BASE_URL: {string}
   * import.meta.env.PROD: {boolean}
   * import.meta.env.DEV: {boolean}
   */

  const { VITE_APP_NODE_ENV, VITE_APP_TITLE } = getEnv(mode);

  setTimeout(() => {
    console.log();
    console.log('\x1b[33m%s\x1b[0m', `🏭--NODE (VITE_APP_NODE_ENV): ${VITE_APP_NODE_ENV}`);
    console.log('\x1b[36m%s\x1b[0m', `🏠--APP (VITE_APP_TITLE): ${VITE_APP_TITLE}`);
    console.log();
  }, 66);

  if (command === 'serve') {
    return defineConfig({ ...baseConfig });
  } else {
    return defineConfig({ ...baseConfig });
  }
};
