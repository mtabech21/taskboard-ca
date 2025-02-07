import { encryptWithPublicKey, importPublicKey } from "@taskboard/tools/functions/public_key";
import { constants, generateKeyPairSync, privateDecrypt } from "crypto";

const {
  publicKey: public_key,
  privateKey: _privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

export function decrypt(enc_string: string) {
  // Convert Uint8Array to Buffer
  const encryptedBuffer = Buffer.from(enc_string, 'base64');

  // Decrypt using the private key
  const decryptedData = privateDecrypt(
    {
      key: _privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedBuffer
  );

  return decryptedData.toString(); // Convert decrypted Buffer to string
}

export async function encrypt(string: string) {
  return await encryptWithPublicKey(await importPublicKey(public_key), string)
}

export { public_key }