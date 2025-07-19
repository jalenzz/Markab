import { useCallback, useEffect, useRef, useState } from 'react';

import { browserApiService, rebuildLayout, updateFolderPositions } from '../services';
import { storageService } from '../services/storageService';
import type { DragItem, FolderColumnsType, FolderItem, FolderStateType } from '../types';
import { useSettings } from './useSettings';

export function useBookmarks() {
    const { settings, isLoading } = useSettings();
    const [folderColumns, setFolderColumns] = useState<FolderColumnsType>([]);
    const [folderState, setFolderState] = useState<FolderStateType>({});
    const [error, setError] = useState<string | null>(null);

    const hasLoadedRef = useRef(false);

    const loadBookmarks = useCallback(
        async (forceReload = false) => {
            // 等待设置加载完成后再加载书签数据
            if (isLoading) {
                return;
            }

            if (hasLoadedRef.current && !forceReload) {
                return;
            }

            try {
                setError(null);

                const savedFolderState = await storageService.loadConfig<FolderStateType>(
                    'folderState',
                    {},
                );
                setFolderState(savedFolderState);

                const allFolders = await browserApiService.getAllFolders(
                    settings.maxTopSites,
                    settings.maxRecentTabs,
                );

                // 过滤掉隐藏的文件夹
                const displayFolders = allFolders.filter(
                    (folder) => !settings.hiddenFolders.includes(folder.id),
                );

                const columns = rebuildLayout(displayFolders, savedFolderState);
                setFolderColumns(columns);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'load data failed');
            } finally {
                hasLoadedRef.current = true;
            }
        },
        [isLoading, settings.hiddenFolders, settings.maxTopSites, settings.maxRecentTabs],
    );

    const handleFolderClick = useCallback((folder: FolderItem) => {
        setFolderState((prevState) => {
            const currentState = prevState[folder.id] || {};
            return {
                ...prevState,
                [folder.id]: {
                    ...currentState,
                    isExpanded: !currentState.isExpanded,
                },
            };
        });
    }, []);

    const handleEmojiChange = useCallback((folderId: string, emoji: string) => {
        setFolderState((prevState) => {
            const currentState = prevState[folderId] || {};
            return {
                ...prevState,
                [folderId]: {
                    ...currentState,
                    emoji,
                },
            };
        });
    }, []);

    useEffect(() => {
        if (!hasLoadedRef.current) {
            return;
        }

        const saveFolderState = async () => {
            await storageService.saveConfig('folderState', folderState);
        };

        saveFolderState();
    }, [folderState]);

    // 初始加载书签（等待设置加载完成）
    useEffect(() => {
        if (!isLoading) {
            loadBookmarks();
        }
    }, [isLoading, loadBookmarks]);

    // 当设置变化时重新加载书签
    useEffect(() => {
        if (hasLoadedRef.current && !isLoading) {
            loadBookmarks(true);
        }
    }, [
        settings.hiddenFolders,
        settings.maxTopSites,
        settings.maxRecentTabs,
        isLoading,
        loadBookmarks,
    ]);

    const handleFolderDrop = useCallback(
        (dragItem: DragItem, targetCol: number, targetIndex: number) => {
            setFolderColumns((prevColumns) => {
                // 取出拖拽的元素
                const draggedFolder = prevColumns[dragItem.sourceCol]?.[dragItem.sourceIndex];

                if (!draggedFolder) {
                    console.error('could not find dragged folder', dragItem);
                    return prevColumns; // 返回原数组，避免不必要的更新
                }

                // 同列内拖拽且位置没有实际变化，直接返回原数组
                if (targetCol === dragItem.sourceCol) {
                    const actualTargetIndex =
                        targetIndex > dragItem.sourceIndex ? targetIndex - 1 : targetIndex;
                    if (actualTargetIndex === dragItem.sourceIndex) {
                        return prevColumns;
                    }
                }

                // 创建新的列数组，但尽量复用未变化的列
                const newColumns = prevColumns.map((column, index) => {
                    // 对于不受影响的列，直接复用原数组引用
                    if (targetCol !== -1 && index !== dragItem.sourceCol && index !== targetCol) {
                        return column;
                    }
                    return [...column]; // 只复制受影响的列
                });

                // 从源位置移除文件夹
                newColumns[dragItem.sourceCol].splice(dragItem.sourceIndex, 1);

                // 检查是否需要创建新列（targetCol = -1）
                if (targetCol === -1) {
                    // 如果源列变空了，移除空列并调整插入位置
                    if (newColumns[dragItem.sourceCol].length === 0) {
                        newColumns.splice(dragItem.sourceCol, 1);
                        // 调整插入位置：如果新列要插入的位置在被删除列之后，需要减 1
                        if (targetIndex > dragItem.sourceCol) {
                            targetIndex = targetIndex - 1;
                        }
                    }

                    // 创建新列：在指定位置插入包含拖拽文件夹的新列
                    const newColumn = [draggedFolder];
                    newColumns.splice(targetIndex, 0, newColumn);
                } else {
                    // 现有列内拖拽：插入到目标位置
                    const finalTargetIndex =
                        dragItem.sourceCol === targetCol && targetIndex > dragItem.sourceIndex
                            ? targetIndex - 1
                            : targetIndex;
                    newColumns[targetCol].splice(finalTargetIndex, 0, draggedFolder);

                    // 如果源列变空了，移除空列
                    if (newColumns[dragItem.sourceCol].length === 0) {
                        newColumns.splice(dragItem.sourceCol, 1);
                    }
                }

                // 拖拽完成后，更新文件夹状态中的位置信息
                setTimeout(() => {
                    setFolderState((prevState) => updateFolderPositions(newColumns, prevState));
                }, 0);

                return newColumns;
            });
        },
        [],
    );

    return {
        folderColumns,
        folderState,
        error,
        handleFolderClick,
        handleEmojiChange,
        handleFolderDrop,
    } as const;
}
