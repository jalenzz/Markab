import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';

import { ANIMATION_CONFIG, SETTINGS_CONFIG, SETTINGS_GROUPS } from '../../config';
import { useModal, useSettings } from '../../hooks';
import type { SettingConfig } from '../../types';
import { SettingsGroup } from './SettingsGroup';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * 设置面板组件
 */
export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const { updateSetting, getSettingValue, resetSettings } = useSettings();
    const { modalRef } = useModal({ isOpen, onClose });

    // 按分组组织设置项
    const groupedSettings = useMemo(() => {
        const groups = new Map<string, { group: typeof SETTINGS_GROUPS[0]; settings: SettingConfig[] }>();

        SETTINGS_GROUPS.forEach(group => {
            groups.set(group.id, {
                group,
                settings: SETTINGS_CONFIG.filter(setting => setting.group === group.id)
            });
        });

        return Array.from(groups.values());
    }, []);

    // 处理背景点击
    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 背景遮罩 */}
                    <motion.div
                        {...ANIMATION_CONFIG.presets.fadeIn}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={handleBackdropClick}
                    />

                    {/* 侧边面板 */}
                    <motion.div
                        ref={modalRef}
                        {...ANIMATION_CONFIG.presets.slideInRight}
                        transition={ANIMATION_CONFIG.transitions.ease}
                        className="fixed right-0 top-0 z-50 h-full w-96 border-l border-newtab-border bg-newtab-surface-elevated shadow-2xl"
                    >
                        {/* 面板头部 */}
                        <div className="flex h-16 items-center justify-between border-b border-newtab-border px-6">
                            <h2 className="text-title font-semibold text-newtab-text-primary">
                                Settings
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-default p-2 text-newtab-text-secondary transition-colors duration-default hover:bg-newtab-surface-hover hover:text-newtab-text-primary"
                                aria-label="Close Settings Panel"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 面板内容 */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {/* 设置分组 */}
                            {groupedSettings.map(({ group, settings }, index) => (
                                <SettingsGroup
                                    key={group.id}
                                    group={group}
                                    settings={settings}
                                    getSettingValue={getSettingValue}
                                    updateSetting={updateSetting}
                                    isFirst={index === 0}
                                />
                            ))}
                        </div>

                        {/* 面板底部 */}
                        <div className="border-t border-newtab-border p-6">
                            <button
                                onClick={resetSettings}
                                className="w-full rounded-default px-4 py-2 text-body text-newtab-text-secondary transition-colors duration-default hover:bg-newtab-surface-hover"
                            >
                                Reset All Settings
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
