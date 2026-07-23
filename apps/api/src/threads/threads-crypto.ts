import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export type EncryptedToken = { tokenCiphertext: string; tokenIv: string; tokenTag: string };

export function encryptToken(token: string, key: Buffer): EncryptedToken {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return {
    tokenCiphertext: ciphertext.toString('base64'),
    tokenIv: iv.toString('base64'),
    tokenTag: cipher.getAuthTag().toString('base64'),
  };
}

export function decryptToken(value: EncryptedToken, key: Buffer) {
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(value.tokenIv, 'base64'));
  decipher.setAuthTag(Buffer.from(value.tokenTag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(value.tokenCiphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
