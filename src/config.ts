import type { SettingConfig, SettingGroup } from './types';

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
        // 侧边面板滑入动画
        slideInRight: {
            initial: { opacity: 0, x: 320 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 320 },
        },
    },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;

// 设置分组配置
export const SETTINGS_GROUPS: SettingGroup[] = [
    {
        id: 'appearance',
        title: 'Appearance',
    },
    {
        id: 'general',
        title: 'General',
    },
];

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
    quickSearch: true,
} as const;

// 设置配置
export const SETTINGS_CONFIG: SettingConfig[] = [
    {
        key: 'theme',
        label: 'Theme',
        type: 'select',
        group: 'appearance',
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
        group: 'appearance',
        placeholder: 'Font name',
    },
    {
        key: 'fontSize',
        label: 'Font Size',
        type: 'slider',
        group: 'appearance',
        min: 10,
        max: 24,
        step: 1,
        showValue: true,
    },
    {
        key: 'maxTopSites',
        label: 'Max Top Sites',
        type: 'slider',
        group: 'general',
        min: 5,
        max: 20,
        step: 1,
        showValue: true,
    },
    {
        key: 'maxRecentTabs',
        label: 'Max Recent Tabs',
        type: 'slider',
        group: 'general',
        min: 5,
        max: 20,
        step: 1,
        showValue: true,
    },
    {
        key: 'lockLayout',
        label: 'Lock Layout',
        type: 'toggle',
        group: 'general',
    },
    {
        key: 'quickSearch',
        label: 'Quick Search',
        description:
            'When enabled, you can directly type to start search without clicking on the page first.',
        type: 'toggle',
        group: 'general',
    },
    {
        key: 'linkOpen',
        label: 'Link Open',
        type: 'select',
        group: 'general',
        options: [
            { value: 'current-tab', label: 'Current Tab' },
            { value: 'new-tab', label: 'New Tab' },
        ],
    },
    {
        key: 'hiddenFolders',
        label: 'Show Folders',
        type: 'multi-select',
        group: 'general',
    },
];
