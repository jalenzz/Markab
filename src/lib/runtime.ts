/** Cross-browser WebExtension namespace (Firefox `browser`, Chromium `chrome`). */
export const webext: typeof chrome =
    (globalThis as typeof globalThis & { browser?: typeof chrome }).browser ?? chrome;

export function isExtensionContext(): boolean {
    return typeof webext?.storage?.local !== 'undefined';
}
