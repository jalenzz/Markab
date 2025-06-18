import Picker from '@emoji-mart/react';
import { FluentEmoji } from '@lobehub/fluent-emoji';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

interface EmojiProps {
    value: string; // 当前 emoji 字符
    onChange: (emoji: string) => void;
}

export const Emoji: React.FC<EmojiProps> = ({ value, onChange }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<'bottom' | 'top'>('bottom');
    const emojiRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    // 点击外部或ESC键关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node)
            ) {
                setIsPickerOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPickerOpen(false);
            }
        };

        if (isPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isPickerOpen]);

    const calculatePickerPosition = () => {
        if (!emojiRef.current) return 'bottom';

        const rect = emojiRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const pickerHeight = 435; // emoji-mart picker 的大致高度
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
            return 'top';
        }

        return 'bottom';
    };

    const handleEmojiClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止触发父组件的点击事件

        const position = calculatePickerPosition();
        setPickerPosition(position);
        setIsPickerOpen(true);
    };

    const handleEmojiSelect = (emojiData: { native: string }) => {
        onChange(emojiData.native);
        setIsPickerOpen(false);
    };

    return (
        <div
            ref={emojiRef}
            className="relative cursor-pointer"
            onClick={handleEmojiClick}
            title="change emoji"
        >
            <FluentEmoji emoji={value} type="anim" size={30} cdn="aliyun" />

            <AnimatePresence>
                {isPickerOpen && (
                    <motion.div
                        ref={pickerRef}
                        className={`absolute left-0 z-50 overflow-hidden rounded-default shadow-lg ${
                            pickerPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Picker
                            data={async () => {
                                const response = await fetch(
                                    'https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/15/native.json',
                                );
                                return response.json();
                            }}
                            onEmojiSelect={handleEmojiSelect}
                            theme="auto"
                            locale="zh"
                            previewPosition="none"
                            skinTonePosition="none"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Emoji;
