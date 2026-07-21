import { hasNaturalnessIssue, isNaturalnessBlocked, reviewNarrative } from './narrative-review';

describe('narrative naturalness review', () => {
  it('flags contrast reframing and an em dash', () => {
    expect(hasNaturalnessIssue('Tes', 'Tes bukan hanya angka. Itu tentang diskusi.')).toBe(true);
    expect(hasNaturalnessIssue('Catatan — singkat', 'Isi biasa.')).toBe(true);
  });

  it('marks generic drafts as blocking', () => {
    const notes = reviewNarrative('Judul', 'Ini bukan sekadar kopi.', undefined);
    expect(isNaturalnessBlocked(notes)).toBe(true);
  });

  it('keeps concrete observation language available', () => {
    expect(hasNaturalnessIssue('Catatan', 'Lucunya, yang bikin gue balik justru obrolan di mejanya.')).toBe(false);
  });

  it('blocks a kite scene that suddenly moves onto a floor', () => {
    const notes = reviewNarrative(
      'aku masih kepikiran warna neon purple',
      'Di tengah main layangan di lapangan, aku ngerasain betapa dramatisnya warna neon purple di atas lantai.',
      { vocabulary: ['aku'] },
    );

    expect(isNaturalnessBlocked(notes)).toBe(true);
    expect(notes.join(' ')).toContain('Detail adegan tidak koheren: layangan dan lantai');
  });

  it('blocks an article hook and detached basketball-product link', () => {
    const url = 'https://shop.example/giannis';
    const notes = reviewNarrative(
      'Logika Transfer Pemain dan Masa Depan LeBron',
      `Garis lapangan basket seringkali menjadi ruang penuh spekulasi.\n\nReferensi yang gue maksud:\n${url}`,
      { vocabulary: ['gw'], referenceTitle: 'Giannis Immortality Basketball Shoes', referenceUrl: url },
    );

    expect(isNaturalnessBlocked(notes)).toBe(true);
    expect(notes.join(' ')).toContain('Human voice');
    expect(notes.join(' ')).toContain('Hook terasa seperti judul artikel');
    expect(notes.join(' ')).toContain('jembatan konteks');
  });

  it('accepts a first-person hook with a reference bridge before the URL', () => {
    const url = 'https://shop.example/giannis';
    const notes = reviewNarrative(
      'gw masih kepikiran cara orang milih sepatu basket',
      `gw baru sadar banyak orang bahas Giannis cuma dari highlight-nya. Padahal sepatu basket yang dipakai juga ngasih petunjuk soal cara dia bergerak. Ini contoh yang bikin gw kepikiran: ${url}`,
      { vocabulary: ['gw'], referenceTitle: 'Giannis Immortality Basketball Shoes', referenceUrl: url },
    );

    expect(isNaturalnessBlocked(notes)).toBe(false);
  });

  it('blocks a news-like draft with no information gap', () => {
    const notes = reviewNarrative('Trade pemain basket musim ini', 'Pergerakan pemain besar memicu diskusi di seluruh liga.', { topic: 'Trade pemain basket musim ini' });

    expect(notes.join(' ')).toContain('Information gap tidak terlihat');
    expect(isNaturalnessBlocked(notes)).toBe(true);
  });

  it('blocks a broad closing question without a specific tension', () => {
    const notes = reviewNarrative('gw masih penasaran soal trade ini', 'Gw masih penasaran kenapa trade ini ramai. Menurut kamu?', { vocabulary: ['gw'] });

    expect(notes.join(' ')).toContain('Pertanyaan penutup terlalu umum');
    expect(isNaturalnessBlocked(notes)).toBe(true);
  });

  it('blocks abstract shoe language and missing thought process', () => {
    const notes = reviewNarrative('Sepatu neon yang dramatis', 'Sepatu ini menambahkan dimensi visual dan punya rahasia tersendiri.');

    expect(notes.join(' ')).toContain('Proses berpikir tidak terlihat');
    expect(notes.join(' ')).toContain('generic metaphor');
    expect(isNaturalnessBlocked(notes)).toBe(true);
  });

  it('allows a coherent personal observation with active doubt', () => {
    const notes = reviewNarrative(
      'Sepatu basket atau tiket masuk komunitas?',
      'Gw kira adik gue pilih sepatu ini karena logonya. Makin dipikir, mungkin dia cuma pengin merasa nyambung sama teman-temannya di lapangan.',
      { vocabulary: ['gw'] },
    );

    expect(isNaturalnessBlocked(notes)).toBe(false);
  });

  it('blocks a beach-wedding story that carries marketplace copy to a product', () => {
    const url = 'https://shop.example/batik';
    const notes = reviewNarrative(
      'Nikahan di pantai, panasnya ngga ada lawan',
      `Gue lagi mikirin acara nikahan di pantai.\n\nAwalnya gue kira semua bakal segar karena ombak, tapi matahari terus menempel.\n\nJadi gue mulai cari cara supaya semua tetap nyaman. Gue nemuin kemeja batik pria premium yang terkesan ringan dan adem di kulit.\n\nTapi suasana komunitas yang hangat itu penting banget. Apakah kemeja ini bakal jadi solusi yang nyaman? ${url}`,
      { topic: 'Nikahan di pantai', vocabulary: ['gue'], referenceTitle: 'Kemeja Batik Pria Premium', referenceUrl: url },
    );

    const text = notes.join(' ');
    expect(text).toContain('Product Injection Score');
    expect(text).toContain('Bahasa marketplace');
    expect(text).toContain('Kualitas diskusi rendah');
    expect(text).toContain('Topic drift');
    expect(isNaturalnessBlocked(notes)).toBe(true);
  });
});
