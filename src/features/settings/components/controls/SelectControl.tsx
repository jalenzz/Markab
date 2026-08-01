import type { SelectSettingConfig } from '../../types';
import { SettingLabel } from '../SettingLabel';

interface SelectControlProps {
    config: SelectSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

export function SelectControl({ config, value, onChange }: SelectControlProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <SettingLabel label={config.label} description={config.description} />
            <div className="flex flex-shrink-0 items-center gap-3" role="group">
                {config.options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            aria-pressed={isSelected}
                            className={`py-0.5 text-body transition-colors duration-default ${
                                isSelected
                                    ? 'font-medium text-newtab-text-primary shadow-[inset_0_-2px_0_0_var(--color-primary)]'
                                    : 'text-newtab-text-secondary hover:text-newtab-text-primary'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
