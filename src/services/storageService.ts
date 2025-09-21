import browser from 'webextension-polyfill';

class StorageService {
    async loadConfig<T>(key: string, defaultValue: T): Promise<T> {
        try {
            const result = await browser.storage.local.get(key);
            return result[key] !== undefined ? (result[key] as T) : defaultValue;
        } catch (error) {
            console.error(`Error loading config for key "${key}":`, error);
            return defaultValue;
        }
    }

    async saveConfig(key: string, value: unknown): Promise<void> {
        try {
            await browser.storage.local.set({ [key]: value });
        } catch (error) {
            console.error(`Error saving config for key "${key}":`, error);
            throw error;
        }
    }

    async loadMultipleConfigs(keysWithDefaults: {
        [key: string]: unknown;
    }): Promise<{ [key: string]: unknown }> {
        try {
            const keys = Object.keys(keysWithDefaults);
            const result = await browser.storage.local.get(keys);
            const configs: { [key: string]: unknown } = {};

            for (const key of keys) {
                configs[key] = result[key] !== undefined ? result[key] : keysWithDefaults[key];
            }

            return configs;
        } catch (error) {
            console.error('Error loading multiple configs:', error);
            return keysWithDefaults;
        }
    }

    async clearAllConfigs(): Promise<void> {
        try {
            await browser.storage.local.clear();
        } catch (error) {
            console.error('Error clearing all configs:', error);
            throw error;
        }
    }

    async removeConfig(key: string): Promise<void> {
        try {
            await browser.storage.local.remove(key);
        } catch (error) {
            console.error(`Error removing config for key "${key}":`, error);
            throw error;
        }
    }
}

export const storageService = new StorageService();
