import type { SettingConfig } from './types';

// 动画配置
export const ANIMATION_CONFIG = {
    // 基础过渡配置
    transitions: {
        ease: { duration: 0.15, ease: [0.42, 0, 0.58, 1] as const },
    },

    // 延迟配置
    delays: {
        page: 0.1, // 页面入场延迟
        stagger: 0.03, // 书签项错开动画延迟
        empty: 0.2, // 空状态显示延迟
    },

    // 预设动画配置
    presets: {
        // 书签项滑入动画
        slideInLeft: {
            initial: { opacity: 0, x: -5 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -5 },
        },
        // 文件夹滑入动画
        slideInUp: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        // 箭头旋转动画
        rotate: (isRotated: boolean) => ({
            animate: { rotate: isRotated ? 90 : 0 },
        }),
    },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;

// 默认设置配置
export const DEFAULT_SETTINGS = {
    theme: 'auto' as const,
    fontSize: 14,
    fontFamily: 'system-ui',
    showMostVisited: true,
    showRecentlyClosed: true,
    lockLayout: false,
    linkOpenBehavior: 'current-tab' as const,
} as const;

// 设置配置
export const SETTINGS_CONFIG: SettingConfig[] = [
    {
        key: 'theme',
        label: 'Theme',
        type: 'select',
        options: [
            { value: 'auto', label: 'Auto' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
        ],
    },
    {
        key: 'fontSize',
        label: 'Font Size',
        type: 'slider',
        min: 10,
        max: 24,
        step: 1,
        showValue: true,
    },
    {
        key: 'fontFamily',
        label: 'Font Family',
        type: 'input',
        placeholder: 'e.g., Arial, "Times New Roman", serif',
    },
    {
        key: 'showMostVisited',
        label: 'Show Most Visited',
        type: 'toggle',
    },
    {
        key: 'showRecentlyClosed',
        label: 'Show Recently Closed',
        type: 'toggle',
    },
    {
        key: 'lockLayout',
        label: 'Lock Layout',
        type: 'toggle',
    },
    {
        key: 'linkOpenBehavior',
        label: 'Link Open Behavior',
        type: 'select',
        options: [
            { value: 'current-tab', label: 'Current Tab' },
            { value: 'new-tab', label: 'New Tab' },
        ],
    },
];
