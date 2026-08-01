import React, {
    lazy,
    startTransition,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

import type { EmojiCatalogBundle, EmojiEntry, EmojiMotionTab } from './emojiPickerStore';
import {
    closeEmojiPicker,
    getEmojiPickerSnapshot,
    handleEmojiPickerSelect,
    preloadEmojiPicker,
    subscribeEmojiPicker,
} from './emojiPickerStore';

const COLS = 8;

const TABS: { id: EmojiMotionTab; label: string }[] = [
    { id: 'animated', label: 'Animated' },
    { id: 'static', label: 'Static' },
];

function onGridClick(event: React.MouseEvent) {
    const native = (event.target as HTMLElement)
        .closest('button[data-native]')
        ?.getAttribute('data-native');
    if (native) handleEmojiPickerSelect(native);
}

function EmojiButtons({ items }: { items: EmojiEntry[] }) {
    return (
        <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            onClick={onGridClick}
        >
            {items.map((e) => (
                <button
                    key={e.id}
                    type="button"
                    title={e.name}
                    data-native={e.native}
                    className="flex h-9 items-center justify-center text-xl leading-none"
                >
                    {e.native}
                </button>
            ))}
        </div>
    );
}

let cachedCatalog: EmojiCatalogBundle | null = null;

const CustomPicker: React.FC = () => {
    const bundle = cachedCatalog;
    const { isOpen } = useSyncExternalStore(subscribeEmojiPicker, getEmojiPickerSnapshot);
    const [tab, setTab] = useState<EmojiMotionTab>('animated');
    const [query, setQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const catalog = bundle?.[tab] ?? null;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q || !catalog) return null;
        return catalog.all.filter(
            (e) => e.name.toLowerCase().includes(q) || e.keywords.some((k) => k.includes(q)),
        );
    }, [query, catalog]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            inputRef.current?.select();
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        } else {
            setQuery('');
            setTab('animated');
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [query, tab]);

    if (!bundle || !catalog) return null;

    return (
        <div className="flex h-[420px] w-[360px] flex-col rounded-xl bg-newtab-surface-elevated text-newtab-text-primary">
            <div className="flex items-center gap-4 border-b border-newtab-border px-3 pt-2">
                {TABS.map(({ id, label }) => {
                    const selected = tab === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            aria-pressed={selected}
                            className={`py-1.5 text-sm transition-colors duration-default ${
                                selected
                                    ? 'font-medium text-newtab-text-primary shadow-[inset_0_-2px_0_0_var(--color-primary)]'
                                    : 'text-newtab-text-secondary hover:text-newtab-text-primary'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <div className="border-b border-newtab-border p-2">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-md border border-newtab-border bg-newtab-surface px-3 py-1.5 text-sm text-newtab-text-primary outline-none placeholder:text-newtab-text-secondary focus:border-newtab-primary"
                />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2">
                {filtered ? (
                    filtered.length === 0 ? (
                        <div className="py-10 text-center text-sm text-newtab-text-secondary">
                            No results
                        </div>
                    ) : (
                        <EmojiButtons items={filtered} />
                    )
                ) : (
                    <div className="flex flex-col gap-1">
                        {catalog.categories.map((cat) => (
                            <section key={cat.id}>
                                <div className="px-1 py-1 text-xs font-medium text-newtab-text-secondary">
                                    {cat.label}
                                </div>
                                <EmojiButtons items={cat.emojis} />
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const LazyPicker = lazy(async () => {
    cachedCatalog = await preloadEmojiPicker();
    return { default: CustomPicker };
});

export const EmojiPickerHost: React.FC = () => {
    const current = useSyncExternalStore(subscribeEmojiPicker, getEmojiPickerSnapshot);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        if (current.isOpen) setHasMounted(true);
        else if (current.isReady) startTransition(() => setHasMounted(true));
    }, [current.isOpen, current.isReady]);

    useEffect(() => {
        if (!current.isOpen) return;

        const onMouseDown = (event: MouseEvent) => {
            const root = document.getElementById('emoji-picker-root');
            const target = event.target as Node;
            if (root?.contains(target)) return;
            if (current.anchor?.contains(target)) return;
            closeEmojiPicker();
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeEmojiPicker();
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [current.isOpen, current.anchor]);

    if (!hasMounted) return null;

    return createPortal(
        <div
            id="emoji-picker-root"
            className="fixed z-50 overflow-hidden rounded-xl border border-newtab-border shadow-lg transition-opacity duration-[120ms] ease-out"
            style={{
                top: current.position.top,
                left: current.position.left,
                visibility: current.isOpen ? 'visible' : 'hidden',
                opacity: current.isOpen ? 1 : 0,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <Suspense fallback={null}>
                <LazyPicker />
            </Suspense>
        </div>,
        document.body,
    );
};

export default EmojiPickerHost;
