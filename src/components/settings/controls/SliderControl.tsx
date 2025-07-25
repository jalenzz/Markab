import type { SliderSettingConfig } from '../../../types';
import { SettingLabel } from '../SettingLabel';

interface SliderControlProps {
    config: SliderSettingConfig;
    value: number;
    onChange: (value: number) => void;
}

export function SliderControl({ config, value, onChange }: SliderControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <SettingLabel label={config.label} description={config.description} />
            <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <input
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={config.step || 1}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-20 accent-newtab-primary"
                    />
                    {config.showValue && (
                        <span className="w-8 text-right text-body font-medium text-newtab-text-primary">
                            {value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
