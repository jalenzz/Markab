import { useSearchStore } from './store';

interface KeyEventLike {
    key: string;
    preventDefault: () => void;
}

export function handleSearchKey(event: KeyEventLike): void {
    const { isActive, results, deactivate, selectPrevious, selectNext, openSelected, openItem } =
        useSearchStore.getState();
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
}
