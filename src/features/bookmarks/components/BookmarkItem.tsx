import { motion } from 'motion/react';
import React from 'react';

import { useSettings } from '@/features/settings/hooks/useSettings';
import { ANIMATION_CONFIG } from '@/shared/animations';

import type { BookmarkItem as BookmarkItemType } from '../types';
import { getFaviconUrl } from '../utils';

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
            const openInNewTab = settings.linkOpen === 'new-tab';
            await bookmark.action(openInNewTab);
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
                className="bookmark-link inline-flex cursor-pointer items-center gap-3 rounded-default px-2 py-1 text-newtab-text-primary no-underline"
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
                <span className="bookmark-title max-w-[200px] truncate text-body font-medium leading-relaxed">
                    {bookmark.title}
                </span>
            </a>
        </motion.div>
    );
};

export default BookmarkItem;
