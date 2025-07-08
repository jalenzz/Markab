import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { ANIMATION_CONFIG } from '../../../config';
import { browserApiService } from '../../../services';
import type { FolderItem, MultiSelectSettingConfig } from '../../../types';

interface MultiSelectControlProps {
    config: MultiSelectSettingConfig;
    value: string[];
    onChange: (value: string[]) => void;
}

export function MultiSelectControl({ config, value, onChange }: MultiSelectControlProps) {
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // 加载所有文件夹
    const loadFolders = useCallback(async () => {
        try {
            const allFolders = await browserApiService.getAllFolders();
            setFolders(allFolders);
        } catch (error) {
            console.error('Failed to load folders:', error);
        }
    }, []);

    useEffect(() => {
        loadFolders();
    }, [loadFolders]);

    const handleFolderToggle = (folderId: string) => {
        const newValue = value.includes(folderId)
            ? value.filter((id) => id !== folderId)
            : [...value, folderId];
        onChange(newValue);
    };

    return (
        <div className="py-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between text-body text-newtab-text-primary-light transition-colors duration-default hover:text-newtab-text-primary-light dark:text-newtab-text-primary-dark dark:hover:text-newtab-text-primary-dark"
            >
                <span>{config.label}</span>
                <div
                    className={`arrow-icon transition-transform duration-150 ease-out ${isExpanded ? 'rotate-90' : ''}`}
                >
                    <svg
                        className="h-4 w-4 text-newtab-text-secondary-light opacity-60 dark:text-newtab-text-secondary-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={ANIMATION_CONFIG.transitions.ease}
                        className="ml-2 mt-2 space-y-1 overflow-hidden"
                    >
                        {folders.map((folder) => (
                            <button
                                key={folder.id}
                                onClick={() => handleFolderToggle(folder.id)}
                                className="px-2 py-1 text-newtab-text-secondary-light transition-all duration-default hover:opacity-60 dark:text-newtab-text-secondary-dark"
                            >
                                <span
                                    className={
                                        value.includes(folder.id) ? 'line-through opacity-60' : ''
                                    }
                                >
                                    {folder.title}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
