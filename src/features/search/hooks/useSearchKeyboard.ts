import { useEffect } from 'react';

import { handleSearchKey } from '../keyboardActions';
import { useSearchStore } from '../store';

export function useSearchKeyboard(): void {
    const isActive = useSearchStore((s) => s.isActive);

    useEffect(() => {
        if (!isActive) return;

        const listener = (event: KeyboardEvent) => {
            handleSearchKey(event);
        };

        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [isActive]);
}
