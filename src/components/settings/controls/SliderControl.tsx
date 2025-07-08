import type { SliderSettingConfig } from '../../../types';

interface SliderControlProps {
    config: SliderSettingConfig;
    value: number;
    onChange: (value: number) => void;
}

export function SliderControl({ config, value, onChange }: SliderControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
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
