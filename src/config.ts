import type { SettingConfig } from './types';

// 动画配置
export const ANIMATION_CONFIG = {
    // 基础过渡配置
    transitions: {
        ease: { duration: 0.15, ease: [0.42, 0, 0.58, 1] as const },
    },

    // 延迟配置
    delays: {
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
        // 淡入动画
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
    },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;

// 默认设置配置
export const DEFAULT_SETTINGS = {
    theme: 'auto' as const,
    fontFamily: '',
    fontSize: 14,
    maxTopSites: 10,
    maxRecentTabs: 10,
    lockLayout: false,
    linkOpen: 'current-tab' as const,
    hiddenFolders: [] as string[],
    autoFocus: true,
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
        key: 'fontFamily',
        label: 'Font',
        type: 'input',
        placeholder: 'Font name',
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
        key: 'maxTopSites',
        label: 'Max Top Sites',
        type: 'slider',
        min: 5,
        max: 20,
        step: 1,
        showValue: true,
    },
    {
        key: 'maxRecentTabs',
        label: 'Max Recent Tabs',
        type: 'slider',
        min: 5,
        max: 20,
        step: 1,
        showValue: true,
    },
    {
        key: 'lockLayout',
        label: 'Lock Layout',
        type: 'toggle',
    },
    {
        key: 'autoFocus',
        label: 'Auto Focus',
        description:
            'Automatically focus the page instead of the address bar. When enabled, you can directly type to start quick search without clicking on the page first.',
        type: 'toggle',
    },
    {
        key: 'linkOpen',
        label: 'Link Open',
        type: 'select',
        options: [
            { value: 'current-tab', label: 'Current Tab' },
            { value: 'new-tab', label: 'New Tab' },
        ],
    },
    {
        key: 'hiddenFolders',
        label: 'Show Folders',
        type: 'multi-select',
    },
];
