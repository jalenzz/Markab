import type { SettingConfig } from '../../types';

interface SettingItemProps {
    config: SettingConfig;
    value: string | number | boolean;
    onChange: (value: string | number | boolean) => void;
}

/**
 * 统一的设置项组件
 * 根据配置类型渲染不同的控件
 */
export function SettingItem({ config, value, onChange }: SettingItemProps) {
    const renderControl = () => {
        switch (config.type) {
            case 'toggle':
                return (
                    <div className="flex-shrink-0">
                        <label className="flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={value as boolean}
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
                );

            case 'select':
                return (
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
                );

            case 'slider':
                return (
                    <div className="flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <input
                                type="range"
                                min={config.min}
                                max={config.max}
                                step={config.step || 1}
                                value={value as number}
                                onChange={(e) => onChange(Number(e.target.value))}
                                className="w-20 accent-newtab-theme-light dark:accent-newtab-theme-dark"
                            />
                            {config.showValue && (
                                <span className="w-8 text-right text-body font-medium text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                                    {value as number}
                                </span>
                            )}
                        </div>
                    </div>
                );

            case 'input':
                return (
                    <div className="flex-shrink-0">
                        <input
                            type="text"
                            value={value as string}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={config.placeholder}
                            className="w-36 rounded-default border border-newtab-text-secondary-light/20 bg-newtab-text-secondary-light/5 px-3 py-1 text-body text-newtab-text-primary-light transition-colors duration-default placeholder:text-newtab-text-secondary-light/50 focus:border-newtab-theme-light focus:outline-none dark:border-newtab-text-secondary-dark/20 dark:bg-newtab-text-secondary-dark/5 dark:text-newtab-text-primary-dark dark:placeholder:text-newtab-text-secondary-dark/50 dark:focus:border-newtab-theme-dark"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex items-center justify-between py-3">
            <label className="mr-3 flex-1 text-body text-newtab-text-secondary-light dark:text-newtab-text-secondary-dark">
                {config.label}
            </label>
            {renderControl()}
        </div>
    );
}
