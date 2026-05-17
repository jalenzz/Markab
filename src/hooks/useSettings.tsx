import type { ReactNode } from 'react';

import { useSettingsStore } from '../features/settings/store';
import type { AppSettings } from '../types';

interface SettingsContextType {
    settings: AppSettings;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    updateSetting: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
    getSettingValue: (key: keyof AppSettings) => AppSettings[keyof AppSettings];
}

interface SettingsProviderProps {
    children: ReactNode;
}

// Kept for backward compatibility; the Zustand store now owns settings state.
// Phase 4 will remove this passthrough and drop the wrapper from App.tsx.
export function SettingsProvider({ children }: SettingsProviderProps) {
    return <>{children}</>;
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
