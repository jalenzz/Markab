import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BookmarkDashboard } from './components';
import { SettingsProvider, useSettings, useSettingsEffects } from './hooks';

// 内部组件，用于应用设置效果
function AppContent() {
    const { settings } = useSettings();

    // 应用设置到 DOM 和 CSS 变量
    useSettingsEffects(settings);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative min-h-screen w-full overflow-hidden">
                <div className="relative z-10 min-h-screen px-10 sm:px-12 lg:px-16 2xl:px-60">
                    <BookmarkDashboard />
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
