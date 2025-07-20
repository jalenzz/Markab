import { useEffect, useRef } from 'react';

/**
 * 通过 URL 重定向绕过 Chrome 的焦点限制
 * ref: https://stackoverflow.com/questions/16684663/chrome-new-tab-page-extension-steal-focus-from-the-address-bar
 */
export function useFocusManagement() {
    const focusTargetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (location.search !== '?focus') {
            // 添加？focus 参数并重新加载页面
            location.search = '?focus';
            throw new Error('Reloading page to bypass focus restriction');
        }

        const setFocus = () => {
            if (focusTargetRef.current) {
                focusTargetRef.current.focus({ preventScroll: true });
            }
        };

        // 延迟设置焦点，确保页面完全加载
        const timeoutId = setTimeout(setFocus, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return { focusTargetRef };
}
