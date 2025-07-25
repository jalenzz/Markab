import { produce } from 'immer';
import React, {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';

import { DEFAULT_SETTINGS } from '../config';
import { storageService } from '../services/storageService';
import type { AppSettings } from '../types';

// 简化的设置操作类型
type SettingsAction =
    | { type: 'LOAD_SETTINGS'; payload: AppSettings }
    | {
          type: 'UPDATE_SETTING';
          payload: { key: keyof AppSettings; value: AppSettings[keyof AppSettings] };
      };

// 设置状态
interface SettingsState {
    settings: AppSettings;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
    switch (action.type) {
        case 'LOAD_SETTINGS':
            return {
                ...state,
                settings: action.payload,
                isLoading: false,
                isInitialized: true,
                error: null,
            };

        case 'UPDATE_SETTING':
            return produce(state, (draft) => {
                // 直接修改 draft，Immer 处理不可变性
                (draft.settings as Record<keyof AppSettings, AppSettings[keyof AppSettings]>)[
                    action.payload.key
                ] = action.payload.value;
            });

        default:
            return state;
    }
}

// 简化的 Context 类型定义
interface SettingsContextType {
    settings: AppSettings;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    updateSetting: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
    getSettingValue: (key: keyof AppSettings) => AppSettings[keyof AppSettings];
}

// 创建 Context
const SettingsContext = createContext<SettingsContextType | null>(null);

// Provider 组件
interface SettingsProviderProps {
    children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
    const [state, dispatch] = useReducer(settingsReducer, {
        settings: DEFAULT_SETTINGS,
        isLoading: true,
        isInitialized: false,
        error: null,
    });

    // 加载设置
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSettings = await storageService.loadConfig<AppSettings>(
                    'appSettings',
                    DEFAULT_SETTINGS,
                );

                // 确保所有默认字段都存在，合并默认设置和保存的设置
                const mergedSettings = {
                    ...DEFAULT_SETTINGS,
                    ...savedSettings,
                };

                dispatch({ type: 'LOAD_SETTINGS', payload: mergedSettings });
            } catch (error) {
                console.error('Failed to load settings:', error);
                dispatch({ type: 'LOAD_SETTINGS', payload: DEFAULT_SETTINGS });
            }
        };

        loadSettings();
    }, []);

    // 保存设置到存储
    useEffect(() => {
        if (!state.isLoading) {
            const saveSettings = async () => {
                try {
                    await storageService.saveConfig('appSettings', state.settings);
                } catch (error) {
                    console.error('Failed to save settings:', error);
                }
            };

            saveSettings();
        }
    }, [state.settings, state.isLoading]);

    // 简化的设置更新方法
    const updateSetting = useCallback(
        (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
            dispatch({
                type: 'UPDATE_SETTING',
                payload: { key, value },
            });
        },
        [],
    );

    // 简化的获取设置值方法
    const getSettingValue = useCallback(
        (key: keyof AppSettings): AppSettings[keyof AppSettings] => {
            const value = state.settings[key];

            // 如果值不存在，返回默认值
            if (value === undefined || value === null) {
                return DEFAULT_SETTINGS[key];
            }

            return value;
        },
        [state.settings],
    );

    const contextValue: SettingsContextType = {
        settings: state.settings,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        error: state.error,
        updateSetting,
        getSettingValue,
    };

    return React.createElement(SettingsContext.Provider, { value: contextValue }, children);
}

// useSettings hook
export function useSettings(): SettingsContextType {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
