import { useCallback, useEffect, useState } from 'react';

import { browserApiService } from '../../services';
import type { FolderItem } from '../../types';

interface MultiSelectProps {
    value: string[]; // 已选中的文件夹 ID 列表
    onChange: (value: string[]) => void;
}

export function MultiSelect({ value, onChange }: MultiSelectProps) {
    const [folders, setFolders] = useState<FolderItem[]>([]);

    // 加载所有文件夹
    const loadFolders = useCallback(async () => {
        try {
            const allFolders = await browserApiService.getAllFolders();
            setFolders(allFolders);
        } catch (error) {
            console.error('Failed to load folders:', error);
        }
    }, []);

    useEffect(() => {
        loadFolders();
    }, [loadFolders]);

    const handleFolderToggle = (folderId: string) => {
        const newValue = value.includes(folderId)
            ? value.filter((id) => id !== folderId)
            : [...value, folderId];
        onChange(newValue);
    };

    return (
        <div className="w-full">
            <div className="border-newtab-border-light bg-newtab-input-bg-light dark:border-newtab-border-dark dark:bg-newtab-input-bg-dark rounded-default border p-3">
                <div className="flex flex-wrap gap-2">
                    {folders.map((folder) => (
                        <button
                            key={folder.id}
                            onClick={() => handleFolderToggle(folder.id)}
                            className="flex items-center rounded-default px-3 py-2 text-body transition-colors duration-default hover:bg-newtab-border-light dark:hover:bg-newtab-border-dark bg-newtab-bg-light text-newtab-text-primary-light dark:bg-newtab-bg-dark dark:text-newtab-text-primary-dark"
                        >
                            <span className={value.includes(folder.id) ? 'line-through opacity-60' : ''}>
                                {folder.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
