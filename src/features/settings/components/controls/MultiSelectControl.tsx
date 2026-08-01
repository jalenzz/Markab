import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { useBookmarksStore } from '@/features/bookmarks/store';
import { ANIMATION_CONFIG } from '@/shared/animations';

import type { MultiSelectSettingConfig } from '../../types';
import { SettingLabel } from '../SettingLabel';

interface MultiSelectControlProps {
    config: MultiSelectSettingConfig;
    value: string[];
    onChange: (value: string[]) => void;
}

export function MultiSelectControl({ config, value, onChange }: MultiSelectControlProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const folders = useBookmarksStore((s) => s.allFolders);
    const sortedFolders = useMemo(
        () => [...folders].sort((a, b) => a.title.localeCompare(b.title)),
        [folders],
    );

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
                className="flex w-full items-center justify-between text-body text-newtab-text-primary transition-colors duration-default hover:text-newtab-text-primary"
            >
                <SettingLabel label={config.label} description={config.description} />
                <div
                    className={`arrow-icon transition-transform duration-150 ease-out ${isExpanded ? 'rotate-90' : ''}`}
                >
                    <svg
                        className="h-4 w-4 text-newtab-text-secondary opacity-60"
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
                        className="ml-2 mt-2 flex flex-wrap gap-x-3 gap-y-1 overflow-hidden"
                    >
                        {sortedFolders.map((folder) => (
                            <button
                                key={folder.id}
                                type="button"
                                onClick={() => handleFolderToggle(folder.id)}
                                className="py-0.5 text-body text-newtab-text-secondary transition-colors duration-default hover:text-newtab-text-primary"
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
