import { useEffect } from 'react';

import { useSearchStore } from '../store';

function isInputFocused(): boolean {
    const active = document.activeElement;
    return !!active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
}

function isTypingKey(event: KeyboardEvent): boolean {
    return (
        event.key.length === 1 &&
        /[a-zA-Z]/.test(event.key) &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
    );
}

export function useGlobalSearchTriggers(): void {
    useEffect(() => {
        const onKeydown = (event: KeyboardEvent) => {
            const { isActive, activate, updateQuery } = useSearchStore.getState();
            if (isActive || isInputFocused()) return;

            const isSlashTrigger = event.key === '/' && !event.ctrlKey && !event.metaKey;
            const isMetaKTrigger = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);

            if (isSlashTrigger || isMetaKTrigger) {
                event.preventDefault();
                activate();
                return;
            }

            if (isTypingKey(event)) {
                event.preventDefault();
                activate();
                requestAnimationFrame(() => {
                    updateQuery(event.key);
                });
            }
        };

        const onPaste = (event: ClipboardEvent) => {
            const { isActive, activate, updateQuery } = useSearchStore.getState();
            if (isActive || isInputFocused()) return;

            const clipboardText = event.clipboardData?.getData('text/plain');
            if (clipboardText && clipboardText.trim()) {
                event.preventDefault();
                activate();
                requestAnimationFrame(() => {
                    updateQuery(clipboardText.trim());
                });
            }
        };

        document.addEventListener('keydown', onKeydown);
        document.addEventListener('paste', onPaste);
        return () => {
            document.removeEventListener('keydown', onKeydown);
            document.removeEventListener('paste', onPaste);
        };
    }, []);
}
