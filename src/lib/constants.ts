export const TOPSITE_FOLDER_ID = 'topsite-folder';
export const RECENT_FOLDER_ID = 'recent-folder';

export const TOPSITE_ITEM_PREFIX = 'topsite-';
export const RECENT_ITEM_PREFIX = 'recent-';

export const SPECIAL_FOLDER_IDS: readonly string[] = [TOPSITE_FOLDER_ID, RECENT_FOLDER_ID];

export const STORAGE_KEYS = {
    FOLDER_STATE: 'folderState',
    APP_SETTINGS: 'appSettings',
} as const;
