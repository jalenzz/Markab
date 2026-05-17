import { useEffect, useRef } from 'react';

interface UseModalOptions {
    isOpen: boolean;
    onClose: () => void;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
}

/**
 * 通用的模态框 hook
 * 处理点击外部关闭和 ESC 键关闭逻辑
 */
export function useModal({
    isOpen,
    onClose,
    closeOnClickOutside = true,
    closeOnEscape = true,
}: UseModalOptions) {
    const modalRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        if (!closeOnClickOutside || !isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, closeOnClickOutside]);

    // ESC 键关闭
    useEffect(() => {
        if (!closeOnEscape || !isOpen) return;

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose, closeOnEscape]);

    return { modalRef };
}
