import { produce } from 'immer';
import { create } from 'zustand';

import { STORAGE_KEYS } from '@/lib/constants';
import { storageService } from '@/lib/storage';

import { DEFAULT_SETTINGS } from './schema';
import type { AppSettings } from './types';

interface SettingsState {
    settings: AppSettings;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}

interface SettingsActions {
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    getSettingValue: <K extends keyof AppSettings>(key: K) => AppSettings[K];
    hydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
    settings: DEFAULT_SETTINGS,
    isLoading: true,
    isInitialized: false,
    error: null,

    updateSetting: (key, value) => {
        set(
            produce((draft: SettingsState) => {
                (draft.settings as AppSettings)[key] = value;
            }),
        );
    },

    getSettingValue: (key) => {
        const value = get().settings[key];
        if (value === undefined || value === null) {
            return DEFAULT_SETTINGS[key];
        }
        return value;
    },

    hydrate: async () => {
        try {
            const saved = await storageService.loadConfig<AppSettings>(
                STORAGE_KEYS.APP_SETTINGS,
                DEFAULT_SETTINGS,
            );
            set({
                settings: { ...DEFAULT_SETTINGS, ...saved },
                isLoading: false,
                isInitialized: true,
                error: null,
            });
        } catch (error) {
            console.error('Failed to load settings:', error);
            set({
                settings: DEFAULT_SETTINGS,
                isLoading: false,
                isInitialized: true,
                error: error instanceof Error ? error.message : 'load settings failed',
            });
        }
    },
}));

let lastPersistedSettings: AppSettings | null = null;
useSettingsStore.subscribe((state) => {
    if (state.isLoading) return;
    if (state.settings === lastPersistedSettings) return;
    lastPersistedSettings = state.settings;
    storageService.saveConfig(STORAGE_KEYS.APP_SETTINGS, state.settings).catch((error) => {
        console.error('Failed to save settings:', error);
    });
});

useSettingsStore.getState().hydrate();
