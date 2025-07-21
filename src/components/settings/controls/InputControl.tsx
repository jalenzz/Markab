import type { InputSettingConfig } from '../../../types';
import { SettingLabel } from '../SettingLabel';

interface InputControlProps {
    config: InputSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

export function InputControl({ config, value, onChange }: InputControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <SettingLabel label={config.label} description={config.description} />
            <div className="flex-shrink-0">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={config.placeholder}
                    className="placeholder:text-newtab-text-primary/50 w-36 rounded-default border border-newtab-border bg-newtab-surface px-3 py-1 text-body text-newtab-text-primary transition-colors duration-default focus:border-newtab-primary focus:outline-none"
                />
            </div>
        </div>
    );
}
