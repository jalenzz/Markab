interface SearchTriggerProps {
    onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="search-trigger group flex h-full w-full items-center gap-3 bg-transparent text-left"
        >
            <svg
                className="h-4 w-4 flex-shrink-0 text-newtab-text-secondary transition-colors duration-200 group-hover:text-newtab-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>

            <span className="flex-1 truncate text-body italic text-newtab-text-secondary">
                search ...
            </span>
        </button>
    );
}
