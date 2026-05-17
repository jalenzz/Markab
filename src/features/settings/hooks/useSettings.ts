import { useSettingsStore } from '../store';
import type { AppSettings } from '../types';

interface SettingsContextType {
    settings: AppSettings;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    updateSetting: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
    getSettingValue: (key: keyof AppSettings) => AppSettings[keyof AppSettings];
}

export function useSettings(): SettingsContextType {
    const settings = useSettingsStore((s) => s.settings);
    const isLoading = useSettingsStore((s) => s.isLoading);
    const isInitialized = useSettingsStore((s) => s.isInitialized);
    const error = useSettingsStore((s) => s.error);
    const updateSetting = useSettingsStore((s) => s.updateSetting);
    const getSettingValue = useSettingsStore((s) => s.getSettingValue);

    return { settings, isLoading, isInitialized, error, updateSetting, getSettingValue };
}
