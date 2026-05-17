export interface AppSettings {
    theme: 'auto' | 'light' | 'dark';
    fontFamily: string;
    fontSize: number;
    topSitesNum: number;
    recentlyClosedNum: number;
    lockLayout: boolean;
    linkOpen: 'current-tab' | 'new-tab';
    hiddenFolders: string[];
    searchEngines: string;
}

export interface SettingOption {
    value: string;
    label: string;
}

export interface BaseSettingConfig {
    key: string;
    label: string;
    description?: string;
    type: 'select' | 'toggle' | 'slider' | 'input' | 'multi-select';
}

export interface SelectSettingConfig extends BaseSettingConfig {
    type: 'select';
    options: SettingOption[];
}

export interface ToggleSettingConfig extends BaseSettingConfig {
    type: 'toggle';
}

export interface SliderSettingConfig extends BaseSettingConfig {
    type: 'slider';
    min: number;
    max: number;
    step?: number;
    showValue?: boolean;
}

export interface InputSettingConfig extends BaseSettingConfig {
    type: 'input';
    placeholder?: string;
}

export interface MultiSelectSettingConfig extends BaseSettingConfig {
    type: 'multi-select';
}

export type SettingConfig =
    | SelectSettingConfig
    | ToggleSettingConfig
    | SliderSettingConfig
    | InputSettingConfig
    | MultiSelectSettingConfig;

export interface SettingsCategory {
    title: string;
    settings: SettingConfig[];
}

export type SettingsConfig = Record<string, SettingsCategory>;
