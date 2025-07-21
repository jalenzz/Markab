// 基础书签类型
export interface BookmarkItem {
    id: string;
    title: string;
    url: string;
    parentId?: string;
    action?: (openInNewTab?: boolean) => Promise<void> | void;
}

// 文件夹类型
export interface FolderItem {
    id: string;
    title: string;
    children: BookmarkItem[];
}

// 布局相关类型
export type FolderColumnsType = FolderItem[][]; // 二维数组，用于列布局

// 文件夹状态
export interface FolderStateType {
    [folderId: string]: {
        isExpanded?: boolean; // 展开状态，默认 false
        columnIndex?: number; // 所在列的索引
        indexInColumn?: number; // 在列中的位置索引
        emoji?: string; // 自定义的 emoji 图标，默认为 '⭐'
    };
}

// 拖拽相关类型
export interface DragItem {
    folderId: string;
    sourceCol: number;
    sourceIndex: number;
}

// 设置相关类型
export interface AppSettings {
    theme: 'auto' | 'light' | 'dark';
    fontFamily: string;
    fontSize: number;
    maxTopSites: number;
    maxRecentTabs: number;
    lockLayout: boolean;
    autoFocus: boolean;
    linkOpen: 'current-tab' | 'new-tab';
    hiddenFolders: string[];
}

// 设置项配置类型定义
export interface SettingOption {
    value: string;
    label: string;
}

export interface BaseSettingConfig {
    key: string;
    label: string;
    description?: string;
    type: 'select' | 'toggle' | 'slider' | 'input' | 'multi-select';
}

export interface SelectSettingConfig extends BaseSettingConfig {
    type: 'select';
    options: SettingOption[];
}

export interface ToggleSettingConfig extends BaseSettingConfig {
    type: 'toggle';
}

export interface SliderSettingConfig extends BaseSettingConfig {
    type: 'slider';
    min: number;
    max: number;
    step?: number;
    showValue?: boolean;
}

export interface InputSettingConfig extends BaseSettingConfig {
    type: 'input';
    placeholder?: string;
}

export interface MultiSelectSettingConfig extends BaseSettingConfig {
    type: 'multi-select';
}

export type SettingConfig =
    | SelectSettingConfig
    | ToggleSettingConfig
    | SliderSettingConfig
    | InputSettingConfig
    | MultiSelectSettingConfig;

// 搜索相关类型
export interface SearchableBookmark extends BookmarkItem {
    folderTitle: string; // 所属文件夹名称，用于显示上下文
}

// 搜索结果项类型
export interface SearchResult {
    type: 'bookmark' | 'web-search';
    id: string;
    title: string;
    url: string; // 统一都有 URL，书签有书签 URL，搜索有搜索 URL
    folderTitle?: string; // 只有书签才有文件夹名称
    action?: (openInNewTab?: boolean) => Promise<void> | void; // 可选的点击回调函数，用于处理特殊操作如默认搜索引擎
}

export interface SearchState {
    isActive: boolean;
    query: string;
    selectedIndex: number;
    results: SearchResult[];
}
