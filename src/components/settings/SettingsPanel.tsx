import { AnimatePresence, motion } from 'motion/react';

import { ANIMATION_CONFIG, SETTINGS_CONFIG } from '../../config';
import { useModal, useSettings } from '../../hooks';
import type { AppSettings } from '../../types';
import { SettingItem } from '.';

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={modalRef}
                    className="fixed right-4 top-4 z-50 w-80 rounded-default border border-transparent bg-newtab-bg-light p-6 shadow-lg shadow-black/10 backdrop-blur-sm dark:border-white/5 dark:bg-newtab-bg-dark dark:shadow-white/10"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={ANIMATION_CONFIG.transitions.ease}
                >
                    {/* 面板标题 */}
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-title font-semibold text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                            Settings
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-default p-1 text-newtab-text-secondary-light transition-colors duration-default dark:text-newtab-text-secondary-dark"
                            aria-label="Close Settings Panel"
                        >
                            ✕
                        </button>
                    </div>

                    {/* 设置项列表 */}
                    <div className="mb-6">
                        {SETTINGS_CONFIG.map((setting) => (
                            <SettingItem
                                key={setting.key}
                                config={setting}
                                value={getSettingValue(setting.key as keyof AppSettings)}
                                onChange={(value) =>
                                    updateSetting(
                                        setting.key as keyof AppSettings,
                                        value as AppSettings[keyof AppSettings],
                                    )
                                }
                            />
                        ))}
                    </div>

                    {/* Reset button */}
                    <button
                        onClick={resetSettings}
                        className="w-full rounded-default px-4 py-2 text-body text-newtab-text-secondary-light transition-colors duration-default hover:bg-newtab-hover-light dark:text-newtab-text-secondary-dark dark:hover:bg-newtab-hover-dark"
                    >
                        Reset All Settings
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
