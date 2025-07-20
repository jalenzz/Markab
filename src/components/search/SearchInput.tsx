import React, { useEffect, useRef } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onKeyDown,
    placeholder = 'search bookmarks...',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // 自动聚焦
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // 当值变化时，将光标移到末尾
    useEffect(() => {
        if (inputRef.current && value) {
             const input = inputRef.current;
            input.setSelectionRange(value.length, value.length);
        }
    }, [value]);

    return (
        <div className="relative px-3 py-1">
            {/* 搜索图标 */}
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <svg
                    className="h-5 w-5 text-newtab-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* 输入框 */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="w-full bg-transparent py-1 pl-9 text-title text-newtab-text-primary placeholder:text-newtab-text-secondary focus:outline-none"
                autoComplete="off"
                spellCheck={false}
            />
        </div>
    );
};
