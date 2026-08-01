/**
 * Scan @lobehub/fluent-emoji-anim-{1..4} WebP assets for an ANIM chunk and
 * regenerate src/features/bookmarks/animatedEmojiCodes.ts.
 *
 * Usage:
 *   bun run generate:animated-emoji
 *
 * First run installs the anim packages into scripts/.cache/ (gitignored).
 * Re-runs reuse the cache unless --fresh is passed.
 * Or point at an existing install:
 *   ANIM_PACKAGES_ROOT=/path/to/node_modules/@lobehub bun run generate:animated-emoji
 */
import { execFileSync } from 'node:child_process';
import { createReadStream, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGES = [
    '@lobehub/fluent-emoji-anim-1@1.0.0',
    '@lobehub/fluent-emoji-anim-2@1.0.0',
    '@lobehub/fluent-emoji-anim-3@1.0.0',
    '@lobehub/fluent-emoji-anim-4@1.0.0',
];

const ANIM = Buffer.from('ANIM');
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const cacheDir = join(__dirname, '.cache', 'fluent-emoji-anim');
const outFile = join(root, 'src', 'features', 'bookmarks', 'animatedEmojiCodes.ts');
const fresh = process.argv.includes('--fresh');
const packagesRoot = process.env.ANIM_PACKAGES_ROOT
    ? join(process.env.ANIM_PACKAGES_ROOT)
    : join(cacheDir, 'node_modules', '@lobehub');

function ensurePackages() {
    if (process.env.ANIM_PACKAGES_ROOT) {
        console.log('Using ANIM_PACKAGES_ROOT=', packagesRoot);
        return;
    }

    const marker = join(packagesRoot, 'fluent-emoji-anim-1');
    if (!fresh && existsSync(marker)) {
        console.log('Using cached packages in', relative(root, cacheDir));
        return;
    }

    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(
        join(cacheDir, 'package.json'),
        JSON.stringify({ name: 'fluent-emoji-anim-cache', private: true }, null, 2),
    );

    const bun = process.platform === 'win32' ? 'bun.exe' : 'bun';
    console.log('Installing anim packages (one-time, ~700MB unpack)…');
    execFileSync(bun, ['add', ...PACKAGES], { cwd: cacheDir, stdio: 'inherit' });
}

function listWebpFiles() {
    const dirs = readdirSync(packagesRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith('fluent-emoji-anim-'))
        .map((d) => join(packagesRoot, d.name, 'assets'));

    const files = [];
    for (const dir of dirs) {
        if (!existsSync(dir)) continue;
        for (const name of readdirSync(dir)) {
            if (name.endsWith('.webp')) files.push(join(dir, name));
        }
    }
    return files;
}

function hasAnimChunk(filePath) {
    return new Promise((resolve, reject) => {
        const stream = createReadStream(filePath, { highWaterMark: 64 * 1024 });
        let carry = Buffer.alloc(0);
        let settled = false;

        const finish = (value) => {
            if (settled) return;
            settled = true;
            stream.destroy();
            resolve(value);
        };

        stream.on('data', (chunk) => {
            const buf = carry.length ? Buffer.concat([carry, chunk]) : chunk;
            if (buf.includes(ANIM)) {
                finish(true);
                return;
            }
            carry = buf.subarray(Math.max(0, buf.length - 3));
        });
        stream.on('error', (err) => {
            if (settled) return;
            settled = true;
            reject(err);
        });
        stream.on('end', () => finish(false));
    });
}

async function main() {
    ensurePackages();
    const files = listWebpFiles();
    if (files.length === 0) {
        console.error('No WebP assets found under', cacheDir);
        process.exit(1);
    }

    console.log(`Scanning ${files.length} WebP files for ANIM…`);
    const animated = [];
    let staticCount = 0;

    for (let i = 0; i < files.length; i++) {
        if ((i + 1) % 500 === 0) console.log(`  ${i + 1}/${files.length}`);
        const file = files[i];
        if (await hasAnimChunk(file)) {
            animated.push(file.replace(/^.*[/\\]/, '').replace(/\.webp$/i, ''));
        } else {
            staticCount++;
        }
    }

    animated.sort((a, b) => a.localeCompare(b, 'en'));

    const body = [
        '// Auto-generated: unicode codes whose Fluent anim WebP contains an ANIM chunk.',
        '// Encoding matches emojiToCode() / FluentEmoji CDN paths.',
        '//',
        '// Regenerate: bun run generate:animated-emoji',
        '// Fresh reinstall of anim packages: bun run generate:animated-emoji -- --fresh',
        '',
        "import { emojiToCode } from './emojiCode';",
        '',
        'export const ANIMATED_EMOJI_CODES: ReadonlySet<string> = new Set([',
        ...animated.map((code) => `    '${code}',`),
        ']);',
        '',
        'export function isAnimatedEmoji(emoji: string): boolean {',
        '    return ANIMATED_EMOJI_CODES.has(emojiToCode(emoji));',
        '}',
        '',
    ].join('\n');

    writeFileSync(outFile, body, 'utf8');
    console.log(
        `Wrote ${animated.length} animated codes (${staticCount} static-in-pack) → ${relative(root, outFile)}`,
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
