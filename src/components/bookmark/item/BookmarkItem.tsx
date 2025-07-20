import { motion } from 'motion/react';
import React from 'react';

import { ANIMATION_CONFIG } from '../../../config';
import { useSettings } from '../../../hooks';
import type { BookmarkItem as BookmarkItemType } from '../../../types';
import { getFaviconUrl } from '../../../utils/bookmarkUtils';

interface BookmarkItemProps {
    bookmark: BookmarkItemType;
    index: number;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, index }) => {
    const { settings } = useSettings();

    const linkTarget = settings.linkOpen === 'new-tab' ? '_blank' : undefined;

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (bookmark.action) {
            e.preventDefault();
            await bookmark.action();
        }
    };

    return (
        <motion.div
            key={bookmark.id}
            className="block"
            {...ANIMATION_CONFIG.presets.slideInLeft}
            transition={{
                ...ANIMATION_CONFIG.transitions.ease,
                delay: index * ANIMATION_CONFIG.delays.stagger,
            }}
        >
            <a
                href={bookmark.url}
                target={linkTarget}
                rel="noopener noreferrer"
                onClick={handleClick}
                className="group/bookmark [data-has-background='true']:[text-shadow:0_1px_3px_rgba(0,0,0,0.4)] [data-has-background='true']:hover:bg-white/10 [data-has-background='true']:dark:hover:bg-black/20 [data-has-background='true']:dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.8)] inline-flex cursor-pointer items-center gap-3 rounded-default px-2 py-1 text-newtab-text-secondary no-underline transition-colors duration-default hover:bg-newtab-surface-hover hover:text-newtab-text-primary hover:no-underline"
                title={bookmark.title}
            >
                <div className="flex-shrink-0">
                    <img
                        src={getFaviconUrl(bookmark.url)}
                        alt={`${bookmark.title} icon`}
                        width={16}
                        height={16}
                        className="rounded-sm"
                    />
                </div>
                <span className="max-w-[200px] truncate text-body font-medium leading-relaxed">
                    {bookmark.title}
                </span>
            </a>
        </motion.div>
    );
};

export default BookmarkItem;
