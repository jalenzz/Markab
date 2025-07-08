import type { SelectSettingConfig } from '../../../types';

interface SelectControlProps {
    config: SelectSettingConfig;
    value: string;
    onChange: (value: string) => void;
}

/**
 * 选择控件组件
 * 提供多选项按钮组功能的UI控件，包含标签显示
 */
export function SelectControl({ config, value, onChange }: SelectControlProps) {
    return (
        <div className="py-3 flex items-center justify-between">
            <label className="text-body text-newtab-text-secondary-light dark:text-newtab-text-secondary-dark mr-3 flex-1">
                {config.label}
            </label>
            <div className="flex-shrink-0">
                <div className="flex overflow-hidden rounded-default border border-newtab-text-secondary-light/20 dark:border-newtab-text-secondary-dark/20">
                    {config.options.map((option, index) => (
                        <div key={option.value} className="flex">
                            <button
                                onClick={() => onChange(option.value)}
                                className={`px-3 py-1 text-body transition-colors duration-default ${
                                    value === option.value
                                        ? 'bg-newtab-theme-light text-white dark:bg-newtab-theme-dark'
                                        : 'bg-newtab-text-secondary-light/5 text-newtab-text-secondary-light hover:bg-newtab-text-secondary-light/15 dark:bg-newtab-text-secondary-dark/5 dark:text-newtab-text-secondary-dark dark:hover:bg-newtab-text-secondary-dark/15'
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
