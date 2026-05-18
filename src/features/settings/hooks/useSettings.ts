import { useSettingsStore } from '../store';

export function useSettings() {
    const settings = useSettingsStore((s) => s.settings);
    const isLoading = useSettingsStore((s) => s.isLoading);
    const isInitialized = useSettingsStore((s) => s.isInitialized);
    const error = useSettingsStore((s) => s.error);
    const updateSetting = useSettingsStore((s) => s.updateSetting);
    const getSettingValue = useSettingsStore((s) => s.getSettingValue);

    return { settings, isLoading, isInitialized, error, updateSetting, getSettingValue };
}
