import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';

import { ANIMATION_CONFIG, SETTINGS_CONFIG } from '../../config';
import { useModal, useSettings } from '../../hooks';
import type { SettingConfig } from '../../types';
import { SettingsCategory } from './SettingsCategory';

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

    const categorizedSettings = useMemo(() => {
        return Object.entries(SETTINGS_CONFIG).map(([categoryId, categoryData]) => ({
            categoryId,
            title: categoryData.title,
            settings: categoryData.settings as SettingConfig[]
        }));
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

                    <motion.div
                        ref={modalRef}
                        {...ANIMATION_CONFIG.presets.slideInRight}
                        transition={ANIMATION_CONFIG.transitions.ease}
                        className="fixed right-0 top-0 z-50 h-full w-96 border-l border-newtab-border bg-newtab-surface-elevated shadow-2xl"
                    >
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

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {categorizedSettings.map(({ categoryId, title, settings }, index) => (
                                <SettingsCategory
                                    key={categoryId}
                                    title={title}
                                    settings={settings}
                                    getSettingValue={getSettingValue}
                                    updateSetting={updateSetting}
                                    isFirst={index === 0}
                                />
                            ))}
                        </div>

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
