import { motion } from 'motion/react';
import React from 'react';

import { ANIMATION_CONFIG } from '../../../config';
import { Emoji } from './Emoji';

interface FolderHeaderProps {
    title: string;
    emoji: string;
    isExpanded: boolean;
    onTitleClick: () => void;
    onEmojiChange: (emoji: string) => void;
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({
    title,
    emoji,
    isExpanded,
    onTitleClick,
    onEmojiChange,
}) => {
    return (
        <motion.div
            className="flex cursor-pointer items-center space-x-4 rounded-default px-1 py-2 transition-colors duration-default hover:bg-newtab-hover-light dark:hover:bg-newtab-hover-dark"
            onClick={onTitleClick}
            transition={ANIMATION_CONFIG.transitions.ease}
        >
            <Emoji value={emoji} onChange={onEmojiChange} />

            <div className="flex flex-1 items-center justify-between">
                <h3 className="truncate text-title font-semibold text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                    {title}
                </h3>

                <motion.div
                    {...ANIMATION_CONFIG.presets.rotate(isExpanded)}
                    transition={ANIMATION_CONFIG.transitions.ease}
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
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FolderHeader;
