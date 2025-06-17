import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BookmarkDashboard } from './components/BookmarkDashboard';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative min-h-screen w-full overflow-hidden">
                <div className="absolute inset-0 bg-newtab-bg-primary-light dark:bg-newtab-bg-primary-dark" />
                <div className="relative z-10 min-h-screen px-10 sm:px-12 lg:px-16 2xl:px-60">
                    <BookmarkDashboard />
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
