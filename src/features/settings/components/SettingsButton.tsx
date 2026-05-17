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
        <button onClick={handleClick} className="fixed right-4 top-4 z-40 text-body">
            🔨
        </button>
    );
}
