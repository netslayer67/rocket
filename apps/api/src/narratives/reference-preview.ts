import { BadRequestException } from '@nestjs/common';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export type ReferencePreview = { host: string; title: string; description: string };

const MAX_BYTES = 80_000;
const MAX_REDIRECTS = 3;

export async function fetchReferencePreview(input: string): Promise<ReferencePreview> {
  let url = parseUrl(input);
  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt++) {
    await assertPublicUrl(url);
    const response = await request(url);
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || attempt === MAX_REDIRECTS) throw new BadRequestException('Redirect link referensi tidak dapat diikuti.');
      url = new URL(location, url);
      continue;
    }
    if (!response.ok) throw new BadRequestException('Link referensi tidak dapat dibaca.');
    if (!response.headers.get('content-type')?.toLowerCase().includes('text/html')) {
      throw new BadRequestException('Link referensi harus menuju halaman HTML publik.');
    }
    return extractReferenceMetadata(url, await readHtml(response));
  }
  throw new BadRequestException('Link referensi tidak dapat dibaca.');
}

export function extractReferenceMetadata(url: URL, html: string): ReferencePreview {
  const title = meta(html, 'og:title') || meta(html, 'twitter:title') || tag(html, 'title') || pathTitle(url) || url.hostname;
  const description = meta(html, 'og:description') || meta(html, 'description') || '';
  return { host: url.hostname, title: clean(title).slice(0, 160), description: clean(description).slice(0, 360) };
}

export function isPublicIp(address: string) {
  if (isIP(address) === 4) {
    const [first, second, third] = address.split('.').map(Number);
    return !(
      first === 0 || first === 10 || first === 127 || first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) || (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && (second === 0 || second === 2 || second === 168)) ||
      (first === 198 && (second === 18 || second === 19 || (second === 51 && third === 100))) ||
      (first === 203 && second === 0 && third === 113)
    );
  }
  if (isIP(address) !== 6) return false;
  const value = address.toLowerCase();
  if (value.startsWith('::ffff:')) return isPublicIp(value.slice(7));
  return !(value === '::' || value === '::1' || value.startsWith('fc') || value.startsWith('fd') || /^fe[89ab]/.test(value));
}

function parseUrl(input: string) {
  try {
    const url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
    return url;
  } catch {
    throw new BadRequestException('Link referensi harus berupa URL HTTP(S) yang valid.');
  }
}

async function assertPublicUrl(url: URL) {
  const host = url.hostname.replace(/\.$/, '').toLowerCase();
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
    throw new BadRequestException('Link lokal tidak didukung.');
  }
  if (isIP(host)) {
    if (!isPublicIp(host)) throw new BadRequestException('Link privat tidak didukung.');
    return;
  }
  try {
    const addresses = await lookup(host, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => !isPublicIp(address))) throw new Error('private');
  } catch {
    throw new BadRequestException('Host link referensi tidak dapat diverifikasi.');
  }
}

async function request(url: URL) {
  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(6_000),
      headers: { Accept: 'text/html', 'User-Agent': 'RocketProject/1.0' },
    });
  } catch {
    throw new BadRequestException('Link referensi tidak dapat dibaca.');
  }
}

export async function readHtml(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = value.byteLength > MAX_BYTES - total ? value.slice(0, MAX_BYTES - total) : value;
    total += chunk.byteLength;
    chunks.push(chunk);
    if (total === MAX_BYTES) {
      await reader.cancel().catch(() => undefined);
      break;
    }
  }
  const joined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(joined);
}

function meta(html: string, name: string) {
  const tagMatch = html.match(new RegExp(`<meta\\b[^>]*(?:property|name)\\s*=\\s*["']${name}["'][^>]*>`, 'i'))?.[0];
  return tagMatch ? attribute(tagMatch, 'content') : '';
}

function tag(html: string, name: string) {
  return html.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '';
}

function attribute(value: string, name: string) {
  return value.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2] ?? '';
}

function pathTitle(url: URL) {
  const segment = url.pathname.split('/').filter(Boolean).at(-1) ?? '';
  try {
    return clean(decodeURIComponent(segment).replace(/[-_]+/g, ' ').replace(/\bi\.\d+(?:\.\d+)*$/i, ''));
  } catch {
    return '';
  }
}

function clean(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&(amp|quot|#39|lt|gt);/g, (_, entity: string) => ({ amp: '&', quot: '"', '#39': "'", lt: '<', gt: '>' })[entity] ?? entity).replace(/\s+/g, ' ').trim();
}
