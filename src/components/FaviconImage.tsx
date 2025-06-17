import React from 'react';

interface FaviconImageProps {
    url: string;
    title: string;
    size?: number;
    className?: string;
}

export const FaviconImage: React.FC<FaviconImageProps> = ({
    url,
    title,
    size = 16,
    className = '',
}) => {
    const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    iconUrl.searchParams.set('pageUrl', url);
    iconUrl.searchParams.set('size', '32');

    return (
        <img
            src={iconUrl.toString()}
            alt={`${title} icon`}
            width={size}
            height={size}
            className={`rounded-sm ${className}`}
        />
    );
};

export default FaviconImage;
