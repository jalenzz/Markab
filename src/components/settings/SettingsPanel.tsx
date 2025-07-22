import { AnimatePresence, motion } from 'motion/react';

import { ANIMATION_CONFIG, SETTINGS_CONFIG } from '../../config';
import { useModal, useSettings } from '../../hooks';
import type { AppSettings, SettingConfig } from '../../types';
import {
    ImageUploadControl,
    InputControl,
    MultiSelectControl,
    SelectControl,
    SliderControl,
    ToggleControl,
} from './controls';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ControlComponentProps {
    config: SettingConfig;
    value: AppSettings[keyof AppSettings];
    onChange: (value: AppSettings[keyof AppSettings]) => void;
}

type ControlComponent = React.ComponentType<ControlComponentProps>;

const controlComponents: Record<SettingConfig['type'], ControlComponent> = {
    'toggle': ToggleControl as ControlComponent,
    'select': SelectControl as ControlComponent,
    'slider': SliderControl as ControlComponent,
    'input': InputControl as ControlComponent,
    'multi-select': MultiSelectControl as ControlComponent,
    'image-upload': ImageUploadControl as ControlComponent,
};

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
                    className="fixed right-4 top-4 z-50 w-80 rounded-default border border-newtab-border bg-newtab-surface-elevated p-6 shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={ANIMATION_CONFIG.transitions.ease}
                >
                    {/* 面板标题 */}
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-title font-semibold text-newtab-text-primary">
                            Settings
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-default p-1 text-newtab-text-secondary transition-colors duration-default hover:text-newtab-text-primary"
                            aria-label="Close Settings Panel"
                        >
                            ✕
                        </button>
                    </div>

                    {/* 设置项列表 */}
                    <div className="mb-6">
                        {SETTINGS_CONFIG.map((setting) => {
                            const ControlComponent = controlComponents[setting.type];
                            if (!ControlComponent) return null;

                            const settingKey = setting.key as keyof AppSettings;
                            const value = getSettingValue(settingKey);
                            const onChange = (newValue: AppSettings[keyof AppSettings]) =>
                                updateSetting(settingKey, newValue);

                            return (
                                <ControlComponent
                                    key={setting.key}
                                    config={setting}
                                    value={value}
                                    onChange={onChange}
                                />
                            );
                        })}
                    </div>

                    {/* Reset button */}
                    <button
                        onClick={resetSettings}
                        className="w-full rounded-default px-4 py-2 text-body text-newtab-text-secondary transition-colors duration-default hover:bg-newtab-surface-hover"
                    >
                        Reset All Settings
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
