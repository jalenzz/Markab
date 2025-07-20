import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Background, BookmarkGrid, QuickSearch, SettingsButton, SettingsPanel } from './components';
import { SettingsProvider, useFocusManagement, useSettings, useSettingsEffects } from './hooks';

function AppContent() {
    const { settings } = useSettings();

    // 设置面板状态管理
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // 应用设置到 DOM 和 CSS 变量
    useSettingsEffects(settings);

    // 页面焦点管理
    const { focusTargetRef } = useFocusManagement();

    const handleSettingsToggle = (isOpen: boolean) => {
        setIsSettingsOpen(isOpen);
    };

    const handleSettingsClose = () => {
        setIsSettingsOpen(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div ref={focusTargetRef} className="relative min-h-screen w-full overflow-hidden">
                <Background />
                <SettingsButton onToggle={handleSettingsToggle} isOpen={isSettingsOpen} />
                <SettingsPanel isOpen={isSettingsOpen} onClose={handleSettingsClose} />
                <QuickSearch />

                <div className="relative z-10 min-h-screen px-10 sm:px-12 lg:px-16 2xl:px-60">
                    <BookmarkGrid />
                </div>
            </div>
        </DndProvider>
    );
}

function App() {
    return (
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    );
}

export default App;
