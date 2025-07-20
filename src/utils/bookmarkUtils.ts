/**
 * 获取网站的 favicon URL
 * @param url 网站 URL
 * @param size 图标尺寸，默认为 32 像素
 * @returns favicon 的完整 URL
 */
export function getFaviconUrl(url: string, size: number = 32): string {
    if (!url) url = 'none';
    const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    iconUrl.searchParams.set('pageUrl', url);
    iconUrl.searchParams.set('size', size.toString());
    return iconUrl.toString();
}
