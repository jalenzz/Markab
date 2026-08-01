/** Shared with FluentEmoji CDN path encoding. */
export function emojiToCode(emoji: string): string {
    return [...emoji].map((char) => char.codePointAt(0)!.toString(16)).join('-');
}
