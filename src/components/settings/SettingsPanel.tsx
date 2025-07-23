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
    const { updateSetting, getSettingValue } = useSettings();
    const { modalRef } = useModal({ isOpen, onClose });

    const categorizedSettings = useMemo(() => {
        return Object.entries(SETTINGS_CONFIG).map(([categoryId, categoryData]) => ({
            categoryId,
            title: categoryData.title,
            settings: categoryData.settings as SettingConfig[],
        }));
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={modalRef}
                    {...ANIMATION_CONFIG.presets.slideInRight}
                    transition={ANIMATION_CONFIG.transitions.ease}
                    className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-newtab-border bg-newtab-surface-elevated shadow-2xl sm:w-96"
                >
                    <div className="flex h-16 shrink-0 items-center justify-between border-b border-newtab-border px-6">
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

                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
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
                </motion.div>
            )}
        </AnimatePresence>
    );
}
