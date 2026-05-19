import React, { useRef } from 'react';

import { openEmojiPicker, preloadEmojiPicker } from './emojiPickerStore';
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
    const emojiRef = useRef<HTMLDivElement>(null);

    const handleEmojiClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (emojiRef.current) {
            openEmojiPicker(emojiRef.current, onEmojiChange);
        }
    };

    return (
        <div
            className="folder-header flex cursor-pointer items-center space-x-4 px-1 py-2"
            onClick={onTitleClick}
        >
            <div
                ref={emojiRef}
                className="relative cursor-pointer"
                onClick={handleEmojiClick}
                onMouseEnter={preloadEmojiPicker}
                title="change emoji"
            >
                <FluentEmoji emoji={emoji} size={30} />
            </div>

            <div className="flex flex-1 items-center justify-between">
                <h3 className="folder-title truncate text-title font-semibold text-newtab-text-primary">
                    {title}
                </h3>

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
            </div>
        </div>
    );
};

export default FolderHeader;
