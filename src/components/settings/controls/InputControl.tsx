import type { InputSettingConfig } from '../../../types';

interface InputControlProps {
    config: InputSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

export function InputControl({ config, value, onChange }: InputControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-36 rounded-default border border-newtab-border bg-newtab-surface px-3 py-1 text-body text-newtab-text-primary transition-colors duration-default placeholder:text-newtab-text-primary/50 focus:border-newtab-primary focus:outline-none"
                />
            </div>
        </div>
    );
}
