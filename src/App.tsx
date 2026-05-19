import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ErrorBoundary } from '@/app/ErrorBoundary';
import { BookmarkGrid } from '@/features/bookmarks/components/BookmarkGrid';
import { EmojiPickerHost } from '@/features/bookmarks/components/EmojiPickerHost';
import { preloadEmojiPicker } from '@/features/bookmarks/components/emojiPickerStore';
import { useBookmarkLoader } from '@/features/bookmarks/hooks/useBookmarkLoader';
import { Search } from '@/features/search/components/Search';
import { SettingsButton } from '@/features/settings/components/SettingsButton';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useSettingsEffects } from '@/features/settings/hooks/useSettingsEffects';

type RequestIdleCallback = (cb: () => void, opts?: { timeout: number }) => number;

function AppContent() {
    const { settings, isInitialized } = useSettings();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useSettingsEffects(settings);
    useBookmarkLoader();

    useEffect(() => {
        if (!isInitialized) return;
        const ric = (window as unknown as { requestIdleCallback?: RequestIdleCallback })
            .requestIdleCallback;
        const run = () => {
            preloadEmojiPicker();
        };
        if (ric) {
            ric(run, { timeout: 2000 });
        } else {
            setTimeout(run, 300);
        }
    }, [isInitialized]);

    if (!isInitialized) return null;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative min-h-screen w-full overflow-hidden">
                <SettingsButton onToggle={setIsSettingsOpen} isOpen={isSettingsOpen} />
                <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                <Search />

                <div className="relative z-10 min-h-screen px-10 sm:px-12 lg:px-16 2xl:px-60">
                    <BookmarkGrid />
                </div>

                <EmojiPickerHost />
            </div>
        </DndProvider>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
}

export default App;
