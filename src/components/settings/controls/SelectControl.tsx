import type { SelectSettingConfig } from '../../../types';

interface SelectControlProps {
    config: SelectSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

export function SelectControl({ config, value, onChange }: SelectControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <div className="flex overflow-hidden rounded-default border border-newtab-text-secondary-light/20 dark:border-newtab-text-secondary-dark/20">
                    {config.options.map((option, index) => (
                        <div key={option.value} className="flex">
                            <button
                                onClick={() => onChange(option.value)}
                                className={`px-2 py-0.5 text-body transition-colors duration-default ${
                                    value === option.value
                                        ? 'bg-newtab-theme-light text-white dark:bg-newtab-theme-dark'
                                        : 'bg-newtab-text-secondary-light/5 text-newtab-text-primary-light hover:bg-newtab-text-secondary-light/15 dark:bg-newtab-text-secondary-dark/5 dark:text-newtab-text-primary-dark dark:hover:bg-newtab-text-secondary-dark/15'
                                }`}
                            >
                                {option.label}
                            </button>
                            {index < config.options.length - 1 && (
                                <div className="w-px bg-newtab-text-secondary-light/20 dark:bg-newtab-text-secondary-dark/20" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
