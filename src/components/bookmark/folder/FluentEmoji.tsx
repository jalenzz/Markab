import React, { useState } from 'react';

// @lobehub/fluent-emoji
function getEmojiUrl(emoji: string): string {
    const unicode = [...emoji].map((char) => char?.codePointAt(0)?.toString(16)).join('-');

    const mainPart = unicode.split('-')[0];
    let pkg: string;
    if (mainPart < '1f469') {
        pkg = '@lobehub/fluent-emoji-anim-1';
    } else if (mainPart >= '1f469' && mainPart < '1f620') {
        pkg = '@lobehub/fluent-emoji-anim-2';
    } else if (mainPart >= '1f620' && mainPart < '1f9a0') {
        pkg = '@lobehub/fluent-emoji-anim-3';
    } else {
        pkg = '@lobehub/fluent-emoji-anim-4';
    }

    return `https://registry.npmmirror.com/${pkg}/latest/files/assets/${unicode}.webp`;
}

interface FluentEmojiProps {
    emoji: string;
    size?: number;
    className?: string;
}

export const FluentEmoji: React.FC<FluentEmojiProps> = ({ emoji, size = 24, className = '' }) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <span
                className={className}
                style={{
                    fontSize: size,
                    lineHeight: 1,
                    display: 'inline-block',
                }}
            >
                {emoji}
            </span>
        );
    }

    const imageUrl = getEmojiUrl(emoji);

    return (
        <img
            src={imageUrl}
            alt={emoji}
            width={size}
            height={size}
            className={className}
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
            }}
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
};

export default FluentEmoji;
