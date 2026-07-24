import { extractReferenceMetadata, isPublicIp, readHtml } from './reference-preview';

describe('reference preview', () => {
  it('uses public metadata without retaining page markup', () => {
    const preview = extractReferenceMetadata(new URL('https://example.com/book'), '<meta property="og:title" content="Madilog &amp; Nalar"><meta name="description" content="Buku pemikiran">');
    expect(preview).toEqual({ host: 'example.com', title: 'Madilog & Nalar', description: 'Buku pemikiran' });
  });

  it('extracts bounded commerce and publishing metadata without the page body', () => {
    const html = `<meta property="og:title" content="Kemeja"><meta property="og:description" content="Katun"><meta property="og:type" content="product"><meta property="og:site_name" content="Shop"><meta property="article:author" content="Rico"><meta property="product:price:amount" content="150000"><meta property="product:price:currency" content="IDR"><link href="https://shop.example/kemeja" rel="canonical">SECRET BODY`;
    const preview = extractReferenceMetadata(new URL('https://shop.example/item'), html);

    expect(preview).toMatchObject({ type: 'product', siteName: 'Shop', author: 'Rico', price: '150000', currency: 'IDR', canonicalUrl: 'https://shop.example/kemeja' });
    expect(JSON.stringify(preview)).not.toContain('SECRET BODY');
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
