import { useEffect, useRef } from 'react';

import { useSettings } from './useSettings';

/**
 * 通过 URL 重定向绕过 Chrome 的焦点限制
 * ref: https://stackoverflow.com/questions/16684663/chrome-new-tab-page-extension-steal-focus-from-the-address-bar
 */
export function useFocusManagement() {
    const { settings, isInitialized } = useSettings();
    const focusTargetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isInitialized || !settings.quickSearch) {
            return;
        }

        if (location.search !== '?focus') {
            window.location.replace(location.pathname + '?focus');
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
    }, [isInitialized, settings.quickSearch]);

    return { focusTargetRef };
}
