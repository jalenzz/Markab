/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEMO_MODE?: string;
    readonly VITE_BROWSER?: 'chrome' | 'firefox';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
