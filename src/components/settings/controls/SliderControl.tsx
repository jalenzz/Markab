import type { SliderSettingConfig } from '../../../types';

interface SliderControlProps {
    config: SliderSettingConfig;
    value: number;
    onChange: (value: number) => void;
}

/**
 * 滑块控件组件
 * 提供数值范围选择功能的UI控件，包含标签显示
 */
export function SliderControl({ config, value, onChange }: SliderControlProps) {
    return (
        <div className="py-3 flex items-center justify-between">
            <label className="text-body text-newtab-text-secondary-light dark:text-newtab-text-secondary-dark mr-3 flex-1">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <input
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={config.step || 1}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-20 accent-newtab-theme-light dark:accent-newtab-theme-dark"
                    />
                    {config.showValue && (
                        <span className="w-8 text-right text-body font-medium text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                            {value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
