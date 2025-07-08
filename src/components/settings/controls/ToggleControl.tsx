import type { ToggleSettingConfig } from '../../../types';

interface ToggleControlProps {
    config: ToggleSettingConfig;
    value: boolean;
    onChange: (value: boolean) => void;
}

export function ToggleControl({ config, value, onChange }: ToggleControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <label className="flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className="sr-only"
                    />
                    <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-default ${
                            value
                                ? 'bg-newtab-theme-light dark:bg-newtab-theme-dark'
                                : 'bg-newtab-text-secondary-light/20 dark:bg-newtab-text-secondary-dark/20'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-newtab-bg-light shadow-sm transition-transform duration-default dark:bg-newtab-bg-dark ${
                                value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </div>
                </label>
            </div>
        </div>
    );
}
