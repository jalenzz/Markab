import React, { useMemo } from 'react';

import type { SearchableBookmark } from '../../types';
import { getFaviconUrl } from '../../utils/bookmarkUtils';
import { highlightText } from '../../utils/searchUtils';

interface SearchResultItemProps {
    bookmark: SearchableBookmark;
    isSelected: boolean;
    query: string;
    index: number;
    onClick: () => void;
    onMouseEnter: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = React.memo(
    ({ bookmark, isSelected, query, index, onClick, onMouseEnter }) => {
        const highlightedTitle = useMemo(
            () => highlightText(bookmark.title, query),
            [bookmark.title, query],
        );

        return (
            <div
                className={`flex cursor-pointer items-center gap-3 px-5 py-2 transition-all duration-default ${
                    isSelected ? 'bg-newtab-surface-hover' : 'hover:bg-newtab-surface-hover'
                }`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                {/* Favicon */}
                <div className="flex-shrink-0">
                    <img
                        src={getFaviconUrl(bookmark.url)}
                        alt=""
                        className="h-4 w-4 rounded-sm"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>

                {/* 书签信息 */}
                <div className="min-w-0 flex-1">
                    {/* 标题 */}
                    <div
                        className="text-body font-medium text-newtab-text-primary"
                        dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />

                    {/* 文件夹名称 */}
                    <div className="text-xs text-newtab-text-secondary">{bookmark.folderTitle}</div>
                </div>

                {/* 数字快捷键提示 */}
                <div className="flex-shrink-0">
                    <kbd className="rounded border border-newtab-border bg-newtab-surface px-1.5 py-0.5 text-xs text-newtab-text-secondary">
                        {index + 1}
                    </kbd>
                </div>
            </div>
        );
    },
);
