import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ErrorBoundary } from '@/app/ErrorBoundary';
import { BookmarkGrid } from '@/features/bookmarks/components/BookmarkGrid';
import { useBookmarkLoader } from '@/features/bookmarks/hooks/useBookmarkLoader';
import { Search } from '@/features/search/components/Search';
import { SettingsButton } from '@/features/settings/components/SettingsButton';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useSettingsEffects } from '@/features/settings/hooks/useSettingsEffects';
import { useFocusManagement } from '@/shared/hooks/useFocusManagement';

function AppContent() {
    const { settings } = useSettings();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useSettingsEffects(settings);
    useBookmarkLoader();

    const { focusTargetRef } = useFocusManagement();

    return (
        <DndProvider backend={HTML5Backend}>
            <div ref={focusTargetRef} className="relative min-h-screen w-full overflow-hidden">
                <SettingsButton onToggle={setIsSettingsOpen} isOpen={isSettingsOpen} />
                <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                <Search />

                <div className="relative z-10 min-h-screen px-10 sm:px-12 lg:px-16 2xl:px-60">
                    <BookmarkGrid />
                </div>
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
