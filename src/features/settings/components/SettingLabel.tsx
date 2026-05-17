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
            <div className="relative">
                <label className="text-body text-newtab-text-primary">{label}</label>
                {description && (
                    <button
                        type="button"
                        className="absolute -right-3 text-xs text-newtab-text-secondary hover:text-newtab-text-primary"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onFocus={() => setShowTooltip(true)}
                        onBlur={() => setShowTooltip(false)}
                        aria-label={`description: ${description}`}
                    >
                        ?
                    </button>
                )}
            </div>
            {description && showTooltip && (
                <div className="absolute bottom-full left-0 z-50 mb-2 transform">
                    <div className="max-w-xs rounded-default bg-newtab-surface-elevated px-3 py-2 text-sm text-newtab-text-primary shadow-lg ring-1 ring-newtab-border">
                        {description}
                    </div>
                </div>
            )}
        </div>
    );
}
