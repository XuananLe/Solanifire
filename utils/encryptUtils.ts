import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Config } from '../config';

export const encryptData = (data: string, iv: Buffer) => {
    const key = hexToBuffer(Config.MASTER_PK);
    if (key.length !== 32) {
        throw new Error('Invalid key length. Key must be 32 bytes for AES-256.');
    }

    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encryptedPk = Buffer.concat([cipher.update(data), cipher.final()]);

    return `${iv.toString('hex')}${encryptedPk.toString('hex')}`;
}

export const decryptData = (pk: string) => {
    const iv = hexToBuffer(pk.slice(0, 32));
    const encryptedPk = hexToBuffer(pk.slice(32));
    const key = hexToBuffer(Config.MASTER_PK);

    if (key.length !== 32) {
        throw new Error('Invalid key length. Key must be 32 bytes for AES-256.');
    }

    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedPk = Buffer.concat([decipher.update(encryptedPk), decipher.final()]);
    return decryptedPk.toString('utf-8');
}

const hexToBuffer = (hex: string): Buffer => {
    try {
        return Buffer.from(hex, 'hex');
    } catch (e) {
        console.error('Error converting hex to buffer:', e);
        return Buffer.alloc(0); // Return an empty buffer on error
    }
}

