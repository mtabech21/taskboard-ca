export async function importPublicKey(pemKey: string) {
  // Remove PEM headers and decode Base64
  const keyData = window.atob(
    pemKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g, "")
  );
  const binaryData = new Uint8Array([...keyData].map((char) => char.charCodeAt(0)));

  // Import the public key
  return await window.crypto.subtle.importKey(
    'spki', // Public key format
    binaryData.buffer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' }, // Match the server hash
    },
    false, // Not extractable
    ['encrypt'] // Usages
  );
}

export async function encryptWithPublicKey(publicKey: CryptoKey, data: string) {
  const encodedData = new TextEncoder().encode(data);
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    encodedData
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}