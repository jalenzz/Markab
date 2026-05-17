import { useCallback } from 'react';

import { useSearchStore } from '../features/search/store';

function isTypingKey(event: KeyboardEvent): boolean {
    return (
        event.key.length === 1 &&
        /[a-zA-Z]/.test(event.key) &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
    );
}

function isInputFocused(): boolean {
    const active = document.activeElement;
    return !!active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
}

export function useSearch() {
    const isActive = useSearchStore((s) => s.isActive);
    const query = useSearchStore((s) => s.query);
    const selectedIndex = useSearchStore((s) => s.selectedIndex);
    const results = useSearchStore((s) => s.results);
    const activate = useSearchStore((s) => s.activate);
    const deactivate = useSearchStore((s) => s.deactivate);
    const updateQuery = useSearchStore((s) => s.updateQuery);
    const selectPrevious = useSearchStore((s) => s.selectPrevious);
    const selectNext = useSearchStore((s) => s.selectNext);
    const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
    const openItem = useSearchStore((s) => s.openItem);
    const openSelected = useSearchStore((s) => s.openSelected);

    const searchState = { isActive, query, selectedIndex, results };

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const { isActive, results } = useSearchStore.getState();
            if (!isActive) return;

            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    deactivate();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    selectPrevious();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    selectNext();
                    break;
                case 'Enter':
                    event.preventDefault();
                    openSelected();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5': {
                    event.preventDefault();
                    const index = parseInt(event.key) - 1;
                    if (index < results.length) {
                        openItem(results[index]);
                    }
                    break;
                }
            }
        },
        [deactivate, selectPrevious, selectNext, openSelected, openItem],
    );

    const handleGlobalKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const { isActive } = useSearchStore.getState();
            if (!isActive && !isInputFocused() && isTypingKey(event)) {
                event.preventDefault();
                activate();
                requestAnimationFrame(() => {
                    updateQuery(event.key);
                });
            }
        },
        [activate, updateQuery],
    );

    const handleGlobalPaste = useCallback(
        (event: ClipboardEvent) => {
            const { isActive } = useSearchStore.getState();
            if (!isActive && !isInputFocused()) {
                const clipboardText = event.clipboardData?.getData('text/plain');
                if (clipboardText && clipboardText.trim()) {
                    event.preventDefault();
                    activate();
                    requestAnimationFrame(() => {
                        updateQuery(clipboardText.trim());
                    });
                }
            }
        },
        [activate, updateQuery],
    );

    return {
        searchState,
        activateSearch: activate,
        deactivateSearch: deactivate,
        updateQuery,
        selectPrevious,
        selectNext,
        setSelectedIndex,
        openSelectedItem: openSelected,
        openItem,
        handleKeyDown,
        handleGlobalKeyDown,
        handleGlobalPaste,
    };
}
