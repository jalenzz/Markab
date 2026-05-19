import React, { useMemo } from 'react';

import { getFaviconUrl } from '@/features/bookmarks/utils';

import { highlightText } from '../searchUtils';
import type { SearchResult } from '../types';

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
                role="option"
                aria-selected={isSelected}
                className="search-result group relative flex cursor-pointer items-center gap-3 py-2 pl-5 pr-4 transition-colors duration-150"
                data-selected={isSelected || undefined}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
            >
                <span
                    aria-hidden="true"
                    className="search-result-indicator pointer-events-none absolute bottom-1.5 left-0 top-1.5 w-[2px] origin-center bg-newtab-primary transition-transform duration-200"
                />

                <div className="flex-shrink-0">
                    {isWebSearch ? (
                        <svg
                            className="h-4 w-4 text-newtab-text-secondary"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    ) : (
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

                <div className="min-w-0 flex-1">
                    <div
                        className="truncate text-body text-newtab-text-primary"
                        dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />
                    {item.folderTitle && (
                        <div className="truncate text-[0.7rem] font-medium uppercase tracking-[0.06em] text-newtab-text-secondary">
                            {item.folderTitle}
                        </div>
                    )}
                </div>

                <kbd className="text-newtab-text-secondary/60 flex-shrink-0 font-primary text-[0.7rem] italic">
                    {index + 1}
                </kbd>
            </div>
        );
    },
);
