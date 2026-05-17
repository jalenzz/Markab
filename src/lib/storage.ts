class StorageService {
    async loadConfig<T>(key: string, defaultValue: T): Promise<T> {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get([key]);
                return result[key] !== undefined ? result[key] : defaultValue;
            } else {
                const stored = localStorage.getItem(key);
                if (stored) {
                    return JSON.parse(stored);
                }
                return defaultValue;
            }
        } catch (error) {
            console.error(`Error loading config for key "${key}":`, error);
            return defaultValue;
        }
    }

    async saveConfig(key: string, value: unknown): Promise<void> {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ [key]: value });
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

            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get(keys);
                const configs: { [key: string]: unknown } = {};

                for (const key of keys) {
                    configs[key] = result[key] !== undefined ? result[key] : keysWithDefaults[key];
                }

                return configs;
            } else {
                // 在开发环境中使用 localStorage 作为后备
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
            }
        } catch (error) {
            console.error('Error loading multiple configs:', error);
            // 如果批量加载失败，返回默认值
            return keysWithDefaults;
        }
    }

    async clearAllConfigs(): Promise<void> {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.clear();
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
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.remove([key]);
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
