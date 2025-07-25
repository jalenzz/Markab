import type { AppSettings, SettingConfig } from '../../types';
import {
    InputControl,
    MultiSelectControl,
    SelectControl,
    SliderControl,
    ToggleControl,
} from './controls';

interface SettingsCategoryProps {
    title: string;
    settings: SettingConfig[];
    getSettingValue: (key: keyof AppSettings) => AppSettings[keyof AppSettings];
    updateSetting: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
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
 * 设置类别组件
 */
export function SettingsCategory({
    title,
    settings,
    getSettingValue,
    updateSetting,
}: SettingsCategoryProps) {
    return (
        <div className="mt-8 first:mt-0">
            <div className="mb-6">
                <h3 className="mb-3 text-title font-medium text-newtab-text-primary">{title}</h3>
                <div className="border-t border-newtab-border opacity-30" />
            </div>

            <div className="mb-8 space-y-2">
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
