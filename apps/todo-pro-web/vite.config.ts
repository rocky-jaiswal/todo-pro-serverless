import type { ConfigEnv } from 'vite';
import { defineConfig } from 'vite';

import fs from 'fs';
import { resolve } from 'path'; // dotenv is a "zero-dependent" module that extracts variables in the env variable from the '.env.xxx' file.

import dotenv from 'dotenv';
import React from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
