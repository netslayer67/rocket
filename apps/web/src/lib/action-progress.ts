export type ProgressAction = 'generate' | 'suggest';
export type ProgressState = 'pending' | 'complete' | 'error';

export function nextProgress(value: number) {
  if (value >= 92) return 92;
  return Math.min(92, value + (value < 50 ? 9 : 4));
}

export function progressDetail(action: ProgressAction, value: number, state: ProgressState) {
  if (state === 'complete') return 'Respons diterima. Menyiapkan hasil untuk ditinjau.';
  if (state === 'error') return 'Permintaan selesai tanpa hasil. Silakan coba lagi.';
  if (action === 'suggest') {
    if (value < 35) return 'Membaca metadata dari link referensi.';
    if (value < 70) return 'Mencari sudut topik yang lebih luas.';
    return 'Merapikan saran agar tetap mudah diedit.';
  }
  if (value < 35) return 'Mengirim brief dan mencari pola yang relevan.';
  if (value < 70) return 'Menyusun narasi sesuai persona.';
  return 'Memeriksa pola bahasa sebelum draft ditampilkan.';
}
