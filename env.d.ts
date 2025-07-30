/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_AMPLITUDE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
 