import type { ToggleSettingConfig } from '../../../types';

interface ToggleControlProps {
    config: ToggleSettingConfig;
    value: boolean;
    onChange: (value: boolean) => void;
}

export function ToggleControl({ config, value, onChange }: ToggleControlProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-primary">
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
                                ? 'bg-newtab-primary'
                                : 'bg-newtab-border'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-newtab-surface-elevated shadow-sm transition-transform duration-default ${
                                value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </div>
                </label>
            </div>
        </div>
    );
}
