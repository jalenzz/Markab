import React from 'react';

import type { SearchableBookmark } from '../../types';
import { highlightText } from '../../utils/searchUtils';

interface SearchResultItemProps {
    bookmark: SearchableBookmark;
    isSelected: boolean;
    query: string;
    onClick: () => void;
    onMouseEnter: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
    bookmark,
    isSelected,
    query,
    onClick,
    onMouseEnter,
}) => {
    const getFaviconUrl = (url: string) => {
        if (!url) url = 'none';
        const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
        iconUrl.searchParams.set('pageUrl', url);
        iconUrl.searchParams.set('size', '32');
        return iconUrl.toString();
    };

    const highlightedTitle = highlightText(bookmark.title, query);

    return (
        <div
            className={`flex cursor-pointer items-center gap-3 px-5 py-2 transition-all duration-default ${
                isSelected
                    ? 'bg-newtab-surface-hover'
                    : 'hover:bg-newtab-surface-hover'
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
                <div className="text-xs text-newtab-text-secondary">
                    {bookmark.folderTitle}
                </div>
            </div>

            {/* 快捷键提示 */}
            <div className="flex-shrink-0">
                <kbd className="rounded px-1.5 py-0.5 text-xs bg-newtab-surface text-newtab-text-secondary border border-newtab-border">
                    ⏎
                </kbd>
            </div>
        </div>
    );
};
