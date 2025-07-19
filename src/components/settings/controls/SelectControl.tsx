import type { SelectSettingConfig } from '../../../types';

interface SelectControlProps {
    config: SelectSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

export function SelectControl({ config, value, onChange }: SelectControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <div className="flex overflow-hidden rounded-default border border-newtab-border">
                    {config.options.map((option, index) => (
                        <div key={option.value} className="flex">
                            <button
                                onClick={() => onChange(option.value)}
                                className={`px-2 py-0.5 text-body transition-colors duration-default ${
                                    value === option.value
                                        ? 'bg-newtab-primary text-white'
                                        : 'bg-newtab-surface text-newtab-text-primary hover:bg-newtab-surface-hover'
                                }`}
                            >
                                {option.label}
                            </button>
                            {index < config.options.length - 1 && (
                                <div className="w-px bg-newtab-border" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
