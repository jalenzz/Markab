import Picker from '@emoji-mart/react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import { ANIMATION_CONFIG } from '../../../config';
import { FluentEmoji } from './FluentEmoji';

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
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<'bottom' | 'top'>('bottom');
    const emojiRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    // 点击外部或 ESC 键关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node)
            ) {
                setIsPickerOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPickerOpen(false);
            }
        };

        if (isPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isPickerOpen]);

    const calculatePickerPosition = () => {
        if (!emojiRef.current) return 'bottom';

        const rect = emojiRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const pickerHeight = 435; // emoji-mart picker 的大致高度
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
            return 'top';
        }

        return 'bottom';
    };

    const handleEmojiClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止触发父组件的点击事件

        const position = calculatePickerPosition();
        setPickerPosition(position);
        setIsPickerOpen(true);
    };

    const handleEmojiSelect = (emojiData: { native: string }) => {
        onEmojiChange(emojiData.native);
        setIsPickerOpen(false);
    };

    return (
        <motion.div
            className="flex cursor-pointer items-center space-x-4 rounded-default px-1 py-2 transition-colors duration-default hover:bg-newtab-hover-light dark:hover:bg-newtab-hover-dark"
            onClick={onTitleClick}
            transition={ANIMATION_CONFIG.transitions.ease}
        >
            <div
                ref={emojiRef}
                className="relative cursor-pointer"
                onClick={handleEmojiClick}
                title="change emoji"
            >
                <FluentEmoji emoji={emoji} size={30} />

                <AnimatePresence>
                    {isPickerOpen && (
                        <motion.div
                            ref={pickerRef}
                            className={`absolute left-0 z-50 overflow-hidden rounded-default shadow-lg ${
                                pickerPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Picker
                                data={async () => {
                                    const response = await fetch(
                                        'https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/15/native.json',
                                    );
                                    return response.json();
                                }}
                                onEmojiSelect={handleEmojiSelect}
                                theme="auto"
                                locale="zh"
                                previewPosition="none"
                                skinTonePosition="none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
