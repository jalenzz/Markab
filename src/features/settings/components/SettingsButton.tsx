interface SettingsButtonProps {
    onToggle: (isOpen: boolean) => void;
    isOpen: boolean;
}

/**
 * 设置按钮组件
 * 显示在右上角，点击后打开/关闭设置面板
 */
export function SettingsButton({ onToggle, isOpen }: SettingsButtonProps) {
    const handleClick = () => {
        onToggle(!isOpen);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={isOpen ? 'Close settings' : 'Open settings'}
            aria-expanded={isOpen}
            className="fixed right-4 top-4 z-40 text-newtab-text-secondary transition-colors duration-default hover:text-newtab-text-primary"
        >
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        </button>
    );
}
