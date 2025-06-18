import { motion } from 'motion/react';
import React from 'react';

import { ANIMATION_CONFIG } from '../../../config';
import type { BookmarkItem as BookmarkItemType } from '../../../types';

interface BookmarkItemProps {
    bookmark: BookmarkItemType;
    index: number;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, index }) => {
    const getFaviconUrl = (url: string) => {
        const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
        iconUrl.searchParams.set('pageUrl', url);
        iconUrl.searchParams.set('size', '32');
        return iconUrl.toString();
    };

    return (
        <motion.div
            key={bookmark.id}
            className="block"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{
                ...ANIMATION_CONFIG.transitions.ease,
                delay: index * ANIMATION_CONFIG.delays.stagger,
            }}
        >
            <motion.a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/bookmark inline-flex cursor-pointer items-center gap-3 rounded-default px-2 py-1 text-newtab-text-secondary-light no-underline hover:bg-newtab-hover-light hover:no-underline dark:text-newtab-text-secondary-dark dark:hover:bg-newtab-hover-dark"
                title={bookmark.title}
                transition={ANIMATION_CONFIG.transitions.ease}
            >
                {bookmark.url && (
                    <div className="flex-shrink-0">
                        <img
                            src={getFaviconUrl(bookmark.url)}
                            alt={`${bookmark.title} icon`}
                            width={16}
                            height={16}
                            className="rounded-sm"
                        />
                    </div>
                )}
                <span className="text-body font-medium leading-relaxed">
                    {bookmark.title.length > 20
                        ? `${bookmark.title.slice(0, 20)}...`
                        : bookmark.title}
                </span>
            </motion.a>
        </motion.div>
    );
};

export default BookmarkItem;
