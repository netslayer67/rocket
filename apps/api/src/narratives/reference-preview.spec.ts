import { extractReferenceMetadata, isPublicIp, readHtml } from './reference-preview';

describe('reference preview', () => {
  it('uses public metadata without retaining page markup', () => {
    const preview = extractReferenceMetadata(new URL('https://example.com/book'), '<meta property="og:title" content="Madilog &amp; Nalar"><meta name="description" content="Buku pemikiran">');
    expect(preview).toEqual({ host: 'example.com', title: 'Madilog & Nalar', description: 'Buku pemikiran' });
  });

  it('rejects private address ranges', () => {
    expect(isPublicIp('127.0.0.1')).toBe(false);
    expect(isPublicIp('10.0.0.1')).toBe(false);
    expect(isPublicIp('8.8.8.8')).toBe(true);
  });

  it('reads only the safe prefix from a large public page', async () => {
    const prefix = '<meta property="og:title" content="Sepatu Basket">';
    const html = await readHtml(new Response(`${prefix}${'x'.repeat(80_000)}`));

    expect(html).toHaveLength(80_000);
    expect(extractReferenceMetadata(new URL('https://shop.example/item'), html).title).toBe('Sepatu Basket');
  });

  it('uses a readable URL slug when a commerce page has no metadata', () => {
    const preview = extractReferenceMetadata(new URL('https://shop.example/Giannis-Older-Kids-Immortality-5-i.123.456'), '');

    expect(preview.title).toBe('Giannis Older Kids Immortality 5');
  });
});
