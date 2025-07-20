import { motion } from 'motion/react';
import React, { useEffect, useRef } from 'react';

import { ANIMATION_CONFIG } from '../../config';
import type { SearchableBookmark } from '../../types';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultsProps {
    results: SearchableBookmark[];
    selectedIndex: number;
    query: string;
    onItemClick: (bookmark: SearchableBookmark) => void;
    onSelectedIndexChange: (index: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
    results,
    selectedIndex,
    query,
    onItemClick,
    onSelectedIndexChange,
}) => {
    const selectedItemRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 自动滚动到选中项
    useEffect(() => {
        if (selectedItemRef.current && containerRef.current) {
            const container = containerRef.current;
            const selectedItem = selectedItemRef.current;
            
            const containerRect = container.getBoundingClientRect();
            const itemRect = selectedItem.getBoundingClientRect();
            
            if (itemRect.top < containerRect.top) {
                // 选中项在可视区域上方
                selectedItem.scrollIntoView({ block: 'start', behavior: 'smooth' });
            } else if (itemRect.bottom > containerRect.bottom) {
                // 选中项在可视区域下方
                selectedItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    if (results.length === 0) {
        return null;
    }

    return (
        <motion.div
            ref={containerRef}
            {...ANIMATION_CONFIG.presets.slideInUp}
            className="max-h-80 overflow-y-auto"
        >
            <div>
                {results.map((bookmark, index) => (
                    <div
                        key={`${bookmark.id}-${bookmark.folderTitle}`}
                        ref={index === selectedIndex ? selectedItemRef : null}
                    >
                        <SearchResultItem
                            bookmark={bookmark}
                            isSelected={index === selectedIndex}
                            query={query}
                            index={index}
                            onClick={() => onItemClick(bookmark)}
                            onMouseEnter={() => onSelectedIndexChange(index)}
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
