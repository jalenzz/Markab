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
                    className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col rounded-l-lg bg-newtab-surface-elevated shadow-2xl sm:w-96"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                        {categorizedSettings.map(({ categoryId, title, settings }) => (
                            <SettingsCategory
                                key={categoryId}
                                title={title}
                                settings={settings}
                                getSettingValue={getSettingValue}
                                updateSetting={updateSetting}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
