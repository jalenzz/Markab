import React, { useEffect, useRef } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = React.memo(
    ({ value, onChange, onKeyDown, placeholder = 'search ...' }) => {
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        useEffect(() => {
            if (inputRef.current && value && document.activeElement !== inputRef.current) {
                const input = inputRef.current;
                input.setSelectionRange(value.length, value.length);
            }
        }, [value]);

        return (
            <div className="flex h-full w-full items-center gap-3">
                <svg
                    className="h-4 w-4 flex-shrink-0 text-newtab-primary"
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

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-body text-newtab-text-primary placeholder:italic placeholder:text-newtab-text-secondary focus:outline-none"
                    autoComplete="off"
                    spellCheck={false}
                />
            </div>
        );
    },
);
