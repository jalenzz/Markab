import type { InputSettingConfig } from '../../../types';

interface InputControlProps {
    config: InputSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

export function InputControl({ config, value, onChange }: InputControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-36 rounded-default border border-newtab-text-secondary-light/20 bg-newtab-text-secondary-light/5 px-3 py-1 text-body text-newtab-text-primary-light transition-colors duration-default placeholder:text-newtab-text-primary-light/50 focus:border-newtab-theme-light focus:outline-none dark:border-newtab-text-secondary-dark/20 dark:bg-newtab-text-secondary-dark/5 dark:text-newtab-text-primary-dark dark:placeholder:text-newtab-text-primary-dark/50 dark:focus:border-newtab-theme-dark"
                />
            </div>
        </div>
    );
}
