import type { AppSettings, SettingConfig, SettingGroup } from '../../types';
import {
    InputControl,
    MultiSelectControl,
    SelectControl,
    SliderControl,
    ToggleControl,
} from './controls';

interface SettingsGroupProps {
    group: SettingGroup;
    settings: SettingConfig[];
    getSettingValue: (key: keyof AppSettings) => AppSettings[keyof AppSettings];
    updateSetting: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
    isFirst?: boolean;
}

interface ControlComponentProps {
    config: SettingConfig;
    value: AppSettings[keyof AppSettings];
    onChange: (value: AppSettings[keyof AppSettings]) => void;
}

type ControlComponent = React.ComponentType<ControlComponentProps>;

const controlComponents: Record<SettingConfig['type'], ControlComponent> = {
    'toggle': ToggleControl as ControlComponent,
    'select': SelectControl as ControlComponent,
    'slider': SliderControl as ControlComponent,
    'input': InputControl as ControlComponent,
    'multi-select': MultiSelectControl as ControlComponent,
};

/**
 * 设置分组组件
 * 用于渲染设置分组标题和分割线，提升界面层次感
 */
export function SettingsGroup({
    group,
    settings,
    getSettingValue,
    updateSetting,
    isFirst = false
}: SettingsGroupProps) {
    return (
        <div>
            {/* 分割线 - 在非第一个分组前显示 */}
            {!isFirst && (
                <div className="mb-8 border-t border-newtab-border opacity-30" />
            )}

            {/* 分组标题 */}
            <div className="mb-6">
                <h3 className="text-title font-medium text-newtab-text-primary">
                    {group.title}
                </h3>
            </div>

            {/* 分组内容 */}
            <div className="space-y-4 mb-8">
                {settings.map((setting) => {
                    const ControlComponent = controlComponents[setting.type];
                    if (!ControlComponent) return null;

                    const settingKey = setting.key as keyof AppSettings;
                    const value = getSettingValue(settingKey);
                    const onChange = (newValue: AppSettings[keyof AppSettings]) =>
                        updateSetting(settingKey, newValue);

                    return (
                        <ControlComponent
                            key={setting.key}
                            config={setting}
                            value={value}
                            onChange={onChange}
                        />
                    );
                })}
            </div>
        </div>
    );
}
