import React, {
    lazy,
    startTransition,
    Suspense,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

import type { EmojiCatalog, EmojiEntry } from './emojiPickerStore';
import {
    closeEmojiPicker,
    getEmojiPickerSnapshot,
    handleEmojiPickerSelect,
    preloadEmojiPicker,
    subscribeEmojiPicker,
} from './emojiPickerStore';

const COLS = 8;
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 28;
const CATEGORY_GAP = 4;
const PADDING = 8;
const BUFFER = 5;

type VirtualRow =
    | { type: 'header'; key: string; label: string; top: number; height: number }
    | { type: 'emojis'; key: string; items: EmojiEntry[]; top: number; height: number };

function buildRows(
    catalog: EmojiCatalog,
    filtered: EmojiEntry[] | null,
): { rows: VirtualRow[]; total: number } {
    const rows: VirtualRow[] = [];
    let top = PADDING;

    if (filtered) {
        for (let i = 0; i < filtered.length; i += COLS) {
            const slice = filtered.slice(i, i + COLS);
            rows.push({
                type: 'emojis',
                key: `s-${i}`,
                items: slice,
                top,
                height: ROW_HEIGHT,
            });
            top += ROW_HEIGHT;
        }
    } else {
        for (const cat of catalog.categories) {
            rows.push({
                type: 'header',
                key: `h-${cat.id}`,
                label: cat.label,
                top,
                height: HEADER_HEIGHT,
            });
            top += HEADER_HEIGHT;
            for (let i = 0; i < cat.emojis.length; i += COLS) {
                const slice = cat.emojis.slice(i, i + COLS);
                rows.push({
                    type: 'emojis',
                    key: `${cat.id}-${i}`,
                    items: slice,
                    top,
                    height: ROW_HEIGHT,
                });
                top += ROW_HEIGHT;
            }
            top += CATEGORY_GAP;
        }
    }
    top += PADDING;
    return { rows, total: top };
}

function findFirstVisible(rows: VirtualRow[], visibleTop: number): number {
    let lo = 0;
    let hi = rows.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        const r = rows[mid];
        if (r.top + r.height > visibleTop) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

function handleGridClick(event: React.MouseEvent) {
    const btn = (event.target as HTMLElement).closest('button[data-native]');
    if (!btn) return;
    const native = btn.getAttribute('data-native');
    if (native) handleEmojiPickerSelect(native);
}

let cachedCatalog: EmojiCatalog | null = null;

const CustomPicker: React.FC = () => {
    const catalog = cachedCatalog;
    const { isOpen } = useSyncExternalStore(subscribeEmojiPicker, getEmojiPickerSnapshot);
    const [query, setQuery] = useState('');
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportH, setViewportH] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            inputRef.current?.select();
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
            setScrollTop(0);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const update = () => setViewportH(el.clientHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q || !catalog) return null;
        const out: EmojiEntry[] = [];
        for (const e of catalog.all) {
            if (e.name.toLowerCase().includes(q) || e.keywords.some((k) => k.includes(q))) {
                out.push(e);
                if (out.length >= 300) break;
            }
        }
        return out;
    }, [query, catalog]);

    const { rows, total } = useMemo(
        () => (catalog ? buildRows(catalog, filtered) : { rows: [], total: 0 }),
        [catalog, filtered],
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
            setScrollTop(0);
        }
    }, [query]);

    const onScroll = () => {
        if (rafRef.current != null) return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
        });
    };

    useEffect(() => {
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    if (!catalog) return null;

    let startIdx = 0;
    let endIdx = 0;
    if (rows.length > 0) {
        const effectiveViewport = viewportH || 360;
        const visibleBottom = scrollTop + effectiveViewport;
        startIdx = findFirstVisible(rows, scrollTop);
        endIdx = startIdx;
        while (endIdx < rows.length && rows[endIdx].top < visibleBottom) endIdx++;
        startIdx = Math.max(0, startIdx - BUFFER);
        endIdx = Math.min(rows.length, endIdx + BUFFER);
    }

    const visibleRows = rows.slice(startIdx, endIdx);
    const isEmptyResult = filtered !== null && filtered.length === 0;

    return (
        <div
            className="flex h-[420px] w-[360px] flex-col bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
            style={{ borderRadius: 12 }}
        >
            <div className="border-b border-[var(--color-border)] p-2">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                />
            </div>
            <div
                ref={scrollRef}
                onScroll={onScroll}
                className="picker-scroll flex-1 overflow-y-auto"
            >
                {isEmptyResult ? (
                    <div className="py-10 text-center text-sm text-[var(--color-text-secondary)]">
                        No results
                    </div>
                ) : (
                    <div style={{ position: 'relative', height: total }} onClick={handleGridClick}>
                        {visibleRows.map((row) =>
                            row.type === 'header' ? (
                                <div
                                    key={row.key}
                                    style={{
                                        position: 'absolute',
                                        top: row.top,
                                        left: PADDING,
                                        right: PADDING,
                                        height: row.height,
                                    }}
                                    className="flex items-end px-1 pb-1 text-xs font-medium text-[var(--color-text-secondary)]"
                                >
                                    {row.label}
                                </div>
                            ) : (
                                <div
                                    key={row.key}
                                    style={{
                                        position: 'absolute',
                                        top: row.top,
                                        left: PADDING,
                                        right: PADDING,
                                        height: row.height,
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                                        gap: '4px',
                                    }}
                                >
                                    {row.items.map((e) => (
                                        <button
                                            key={e.id}
                                            type="button"
                                            title={e.name}
                                            data-native={e.native}
                                            className="flex h-9 items-center justify-center rounded-md text-xl leading-none hover:bg-[var(--color-surface-hover)]"
                                        >
                                            {e.native}
                                        </button>
                                    ))}
                                </div>
                            ),
                        )}
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

const PickerSlot = React.memo(() => (
    <Suspense fallback={null}>
        <LazyPicker />
    </Suspense>
));
PickerSlot.displayName = 'PickerSlot';

export const EmojiPickerHost: React.FC = () => {
    const current = useSyncExternalStore(subscribeEmojiPicker, getEmojiPickerSnapshot);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        if (current.isOpen) {
            setHasMounted(true);
        } else if (current.isReady) {
            startTransition(() => setHasMounted(true));
        }
    }, [current.isOpen, current.isReady]);

    useEffect(() => {
        if (!current.isOpen) return;

        const onMouseDown = (event: MouseEvent) => {
            const root = document.getElementById('emoji-picker-root');
            const target = event.target as Node;
            if (root && root.contains(target)) return;
            if (current.anchor && current.anchor.contains(target)) return;
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
            style={{
                position: 'fixed',
                top: current.position.top,
                left: current.position.left,
                zIndex: 50,
                visibility: current.isOpen ? 'visible' : 'hidden',
                opacity: current.isOpen ? 1 : 0,
                transition: 'opacity 120ms ease-out',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                border: '1px solid var(--color-border)',
                contain: 'layout style',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <PickerSlot />
        </div>,
        document.body,
    );
};

export default EmojiPickerHost;
