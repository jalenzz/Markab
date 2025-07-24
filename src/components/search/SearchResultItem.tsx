import React, { useMemo } from 'react';

import type { SearchResult } from '../../types';
import { getFaviconUrl } from '../../utils/bookmarkUtils';
import { highlightText } from '../../utils/searchUtils';

interface SearchResultItemProps {
    item: SearchResult;
    isSelected: boolean;
    query: string;
    index: number;
    onClick: () => void;
    onMouseEnter: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = React.memo(
    ({ item, isSelected, query, index, onClick, onMouseEnter }) => {
        const highlightedTitle = useMemo(
            () => highlightText(item.title, query),
            [item.title, query],
        );

        const isWebSearch = item.type === 'web-search';

        return (
            <div
                className={`flex cursor-pointer items-center gap-3 px-5 py-2 transition-all duration-default ${
                    isSelected ? 'bg-newtab-surface-hover' : 'hover:bg-newtab-surface-hover'
                }`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                {/* 图标 */}
                <div className="flex-shrink-0">
                    {isWebSearch ? (
                        // 搜索图标
                        <div className="flex h-4 w-4 items-center justify-center">
                            <span className="text-xs">🔍</span>
                        </div>
                    ) : (
                        // 书签 Favicon
                        <img
                            src={getFaviconUrl(item.url)}
                            alt=""
                            className="h-4 w-4 rounded-sm"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    )}
                </div>

                {/* 内容信息 */}
                <div className="min-w-0 flex-1">
                    {/* 标题 */}
                    <div
                        className="text-body font-medium text-newtab-text-primary"
                        dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />

                    {/* 副标题 */}
                    <div className="text-xs text-newtab-text-secondary">{item.folderTitle}</div>
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
