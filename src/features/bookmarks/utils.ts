import { webext } from '@/lib/runtime';

const isFirefoxBuild = import.meta.env.VITE_BROWSER === 'firefox';

/** ponytail: deterministic hue from hostname; upgrade path = user-picked palette */
function getLetterTileUrl(url: string, size: number): string {
    let letter = '?';
    let host = '';
    try {
        host = new URL(url).hostname.replace(/^www\./, '');
        letter = (host[0] ?? '?').toUpperCase();
    } catch {
        /* keep defaults */
    }

    let hash = 0;
    for (const char of host) {
        hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    const hue = hash % 360;
    const fontSize = Math.round(size * 0.55);

    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
        `<rect width="100%" height="100%" rx="4" fill="hsl(${hue} 45% 45%)"/>` +
        `<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" ` +
        `fill="white" font-size="${fontSize}" font-family="system-ui,sans-serif">${letter}</text>` +
        `</svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * 获取网站的 favicon URL
 * @param url 网站 URL
 * @param size 图标尺寸，默认为 32 像素
 * @returns favicon 的完整 URL
 */
export function getFaviconUrl(url: string, size: number = 32): string {
    if (!url) url = 'none';

    if (isFirefoxBuild) {
        return getLetterTileUrl(url, size);
    }

    const iconUrl = new URL(webext.runtime.getURL('/_favicon/'));
    iconUrl.searchParams.set('pageUrl', url);
    iconUrl.searchParams.set('size', size.toString());
    return iconUrl.toString();
}
