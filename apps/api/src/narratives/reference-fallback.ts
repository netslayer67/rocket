export function fallbackAngles(title: string): [string, string] {
  // ponytail: title-only category map; add a category only after a reviewed fallback failure.
  if (/\b(?:kemeja|batik|baju|pakaian|celana|rok|dress|sepatu|jaket)\b/iu.test(title)) {
    return ['Apa yang biasanya bikin orang ragu memilih pakaian untuk acara yang ingin terasa pantas tanpa terasa jadi orang lain?', 'Di antara ingin terlihat rapi dan ingin tetap nyaman, bagian mana yang paling sering bikin orang salah pilih?'];
  }
  if (/\b(?:earphone|earbuds?|headphone|headset|tws|speaker)\b/iu.test(title)) {
    return ['Di momen apa orang sebenarnya butuh ruang dengar sendiri, bukan sekadar menambah perangkat baru?', 'Sebelum memilih perangkat audio, gangguan seperti apa yang paling ingin dikurangi saat aktivitas harian?'];
  }
  if (/\b(?:harddisk|hardisk|ssd|flashdisk|storage|penyimpanan)\b/iu.test(title)) {
    return ['Kapan orang mulai sadar file dan foto butuh tempat yang tidak terus bergantung pada langganan?', 'Di antara menyimpan, memindahkan, dan mencadangkan file, bagian mana yang paling sering bikin orang menunda?'];
  }
  return ['Kebutuhan apa yang perlu jelas dulu sebelum sebuah pilihan benar-benar layak dibagikan?', 'Dalam situasi seperti apa sebuah pilihan terasa membantu, bukan cuma menambah barang yang jarang dipakai?'];
}
