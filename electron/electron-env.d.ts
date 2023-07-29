/// <reference types="vite-plugin-electron/electron-env.d.ts" />

declare namespace NodeJS {
  interface ProcessEnv {
    DIST_ELECTRON: string;
    DIST: string;
    /** /dist/ or /public/ */
    PUBLIC: string;
  }
}
