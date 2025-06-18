import { AnimatePresence } from 'motion/react';
import React from 'react';

import type { BookmarkItem as BookmarkItemType } from '../../../types';
import { BookmarkItem } from '../item';

interface BookmarkListProps {
    bookmarks: BookmarkItemType[];
    isExpanded: boolean;
}

export const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, isExpanded }) => {
    return (
        <div className="pb-1 pl-6 pr-1 pt-1">
            <AnimatePresence>
                {isExpanded && (
                    <div className="space-y-0.5">
                        {bookmarks.map((bookmark, index) => (
                            <BookmarkItem key={bookmark.id} bookmark={bookmark} index={index} />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookmarkList;
