const PICKER_HEIGHT = 420;
const PICKER_WIDTH = 360;

type Snapshot = {
    isOpen: boolean;
    isReady: boolean;
    anchor: HTMLElement | null;
    position: { top: number; left: number };
};

let snapshot: Snapshot = {
    isOpen: false,
    isReady: false,
    anchor: null,
    position: { top: 0, left: 0 },
};

let pendingSelect: ((native: string) => void) | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const subscribeEmojiPicker = (cb: () => void) => {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
};

export const getEmojiPickerSnapshot = () => snapshot;

export function openEmojiPicker(anchor: HTMLElement, onSelect: (native: string) => void) {
    const rect = anchor.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    const spaceBelow = viewportH - rect.bottom;
    const placeAbove = spaceBelow < PICKER_HEIGHT && rect.top > PICKER_HEIGHT;

    const top = placeAbove ? Math.max(8, rect.top - 8 - PICKER_HEIGHT) : rect.bottom + 8;
    const left = Math.min(Math.max(8, rect.left), viewportW - PICKER_WIDTH - 8);

    pendingSelect = onSelect;
    snapshot = { ...snapshot, isOpen: true, anchor, position: { top, left } };
    emit();
}

export function closeEmojiPicker() {
    if (!snapshot.isOpen) return;
    pendingSelect = null;
    snapshot = { ...snapshot, isOpen: false };
    emit();
}

export const handleEmojiPickerSelect = (native: string) => {
    if (pendingSelect) pendingSelect(native);
    closeEmojiPicker();
};

export type EmojiEntry = {
    id: string;
    native: string;
    name: string;
    keywords: string[];
};

export type EmojiCategory = {
    id: string;
    label: string;
    emojis: EmojiEntry[];
};

export type EmojiCatalog = {
    categories: EmojiCategory[];
    all: EmojiEntry[];
};

type RawData = {
    categories: { id: string; emojis: string[] }[];
    emojis: Record<
        string,
        { id: string; name: string; keywords: string[]; skins: { native: string }[] }
    >;
};

const CATEGORY_LABELS: Record<string, string> = {
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
};

let preloadPromise: Promise<EmojiCatalog> | null = null;
export function preloadEmojiPicker(): Promise<EmojiCatalog> {
    if (preloadPromise) return preloadPromise;
    preloadPromise = (async () => {
        const dataMod = await import('@emoji-mart/data/sets/15/native.json');
        const raw = dataMod.default as RawData;

        const categories: EmojiCategory[] = [];
        const all: EmojiEntry[] = [];
        for (const cat of raw.categories) {
            const items: EmojiEntry[] = [];
            for (const eid of cat.emojis) {
                const e = raw.emojis[eid];
                if (!e) continue;
                const native = e.skins[0]?.native;
                if (!native) continue;
                const entry = { id: e.id, native, name: e.name, keywords: e.keywords };
                items.push(entry);
                all.push(entry);
            }
            categories.push({
                id: cat.id,
                label: CATEGORY_LABELS[cat.id] ?? cat.id,
                emojis: items,
            });
        }
        snapshot = { ...snapshot, isReady: true };
        emit();
        return { categories, all };
    })();
    return preloadPromise;
}
