import CryptoJS from "crypto-js";

// Salt from C#
const salt = CryptoJS.enc.Hex.parse("4976616e204d65647665646576");

// Convert UTF-16LE text to WordArray
function utf16leToWordArray(str) {
  const buf = new ArrayBuffer(str.length * 2);
  const view = new Uint16Array(buf);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return CryptoJS.lib.WordArray.create(buf);
}

// PasswordDeriveBytes (PBKDF1 equivalent)
function deriveBytes(password, size) {
  let data = CryptoJS.enc.Utf8.parse(password);
  let derived = CryptoJS.SHA1(CryptoJS.lib.WordArray.create([...data.words, ...salt.words]));

  while (derived.sigBytes < size) {
    derived = CryptoJS.SHA1(derived);
  }

  return CryptoJS.lib.WordArray.create(derived.words, size);
}

export function encrypt(text, password) {
  const key = deriveBytes(password, 32); // 32-byte key
  const iv = deriveBytes(password, 16);  // 16-byte IV

  const plaintext = utf16leToWordArray(text);

  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}
