import { isExtensionContext, webext } from './runtime';

class StorageService {
    async loadConfig<T>(key: string, defaultValue: T): Promise<T> {
        try {
            if (isExtensionContext()) {
                const result = await webext.storage.local.get([key]);
                return result[key] !== undefined ? result[key] : defaultValue;
            }

            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored);
            }
            return defaultValue;
        } catch (error) {
            console.error(`Error loading config for key "${key}":`, error);
            return defaultValue;
        }
    }

    async saveConfig(key: string, value: unknown): Promise<void> {
        try {
            if (isExtensionContext()) {
                await webext.storage.local.set({ [key]: value });
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
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

            if (isExtensionContext()) {
                const result = await webext.storage.local.get(keys);
                const configs: { [key: string]: unknown } = {};

                for (const key of keys) {
                    configs[key] = result[key] !== undefined ? result[key] : keysWithDefaults[key];
                }

                return configs;
            }

            const configs: { [key: string]: unknown } = {};

            for (const key of keys) {
                const stored = localStorage.getItem(key);
                if (stored) {
                    configs[key] = JSON.parse(stored);
                } else {
                    configs[key] = keysWithDefaults[key];
                }
            }

            return configs;
        } catch (error) {
            console.error('Error loading multiple configs:', error);
            return keysWithDefaults;
        }
    }

    async clearAllConfigs(): Promise<void> {
        try {
            if (isExtensionContext()) {
                await webext.storage.local.clear();
            } else {
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error clearing all configs:', error);
            throw error;
        }
    }

    async removeConfig(key: string): Promise<void> {
        try {
            if (isExtensionContext()) {
                await webext.storage.local.remove([key]);
            } else {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing config for key "${key}":`, error);
            throw error;
        }
    }
}

export const storageService = new StorageService();
