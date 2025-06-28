import { useEffect } from 'react';

import type { AppSettings } from '../types';

/**
 * 将设置应用到 DOM 和 CSS 变量的 hook
 * 负责响应设置变化并实时更新页面样式
 */
export function useSettingsEffects(settings: AppSettings) {
    // 应用所有设置到 DOM
    useEffect(() => {
        const root = document.documentElement;
        let cleanup: (() => void) | undefined;

        // 应用主题设置
        if (settings.theme !== undefined) {
            root.classList.remove('light', 'dark');
            root.setAttribute('data-theme', settings.theme);

            if (settings.theme === 'auto') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

                const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
                    if (e.matches) {
                        root.classList.add('dark');
                    } else {
                        root.classList.add('light');
                    }
                };

                updateTheme(mediaQuery);
                mediaQuery.addEventListener('change', updateTheme);

                cleanup = () => {
                    mediaQuery.removeEventListener('change', updateTheme);
                };
            } else {
                root.classList.add(settings.theme);
            }
        }

        // 应用字体大小设置
        if (settings.fontSize !== undefined) {
            root.style.setProperty('--font-size-body', `${settings.fontSize}px`);
            root.style.setProperty('--font-size-title', `${settings.fontSize * 1.25}px`);
            root.setAttribute('data-font-size', settings.fontSize.toString());
        }

        // 应用字体族设置
        if (settings.fontFamily !== undefined) {
            root.style.setProperty('--font-family-primary', settings.fontFamily);
            root.setAttribute('data-font-family', settings.fontFamily);
        }

        return cleanup;
    }, [settings.theme, settings.fontSize, settings.fontFamily]);
}
