import { useState } from 'react';

interface SettingLabelProps {
    label: string;
    description?: string;
}

/**
 * 设置项标签组件
 * 显示设置项的标签，如果有描述信息则在右上角显示问号图标
 * 鼠标悬停在问号上时显示描述信息
 */
export function SettingLabel({ label, description }: SettingLabelProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative mr-3 flex flex-1 items-center">
            <label className="text-body text-newtab-text-primary">{label}</label>
            {description && (
                <div className="relative ml-2">
                    <button
                        type="button"
                        className="bg-newtab-text-primary/20 text-newtab-text-primary/70 hover:bg-newtab-text-primary/30 flex h-4 w-4 items-center justify-center rounded-full text-xs transition-colors duration-default hover:text-newtab-text-primary"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onFocus={() => setShowTooltip(true)}
                        onBlur={() => setShowTooltip(false)}
                        aria-label={`description: ${description}`}
                    >
                        ?
                    </button>
                    {showTooltip && (
                        <div className="absolute bottom-full right-0 z-50 mb-2 transform">
                            <div className="w-64 rounded-default bg-newtab-surface-elevated px-3 py-2 text-sm text-newtab-text-primary shadow-lg ring-1 ring-newtab-border">
                                {description}
                                <div className="absolute right-4 top-full transform">
                                    <div className="h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-newtab-surface-elevated"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
