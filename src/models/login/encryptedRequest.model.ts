import { Token } from './token.model';
import CryptoJS from 'crypto-js';

export class EncryptedRequest {
  message = '';
  key1id = '';

  EncryptedRequest() {
  }

  generateKeys(token: Token) {
    let encKey = token.encgenkey1;
    if (encKey == null) {
      encKey = CryptoJS.PBKDF2(token.key1phrase, CryptoJS.enc.Hex.parse(token.key1salt), {
        keySize: 128 / 32,
        iterations: 10000
      });
      token.encgenkey1 = encKey;
    }
    let decKey = token.decgenkey2;
    if (decKey == null) {
      decKey = CryptoJS.PBKDF2(token.key2phrase, CryptoJS.enc.Hex.parse(token.key2salt), {
        keySize: 128 / 32,
        iterations: 10000
      });
      token.decgenkey2 = decKey;
    }
  }
  generateEncryptedMessage(requestObj: object, token: Token, isKey2NotReq: boolean) {
    // Step 1
    if (!isKey2NotReq) {
      requestObj = { ...requestObj, key2id: token.key2id };
    }
    let key = token.encgenkey1;
    if (key == null) {
      key = CryptoJS.PBKDF2(token.key1phrase, CryptoJS.enc.Hex.parse(token.key1salt), {
        keySize: 128 / 32,
        iterations: 10000
      });
      token.encgenkey1 = key;
    }
    const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(requestObj), key, { iv: CryptoJS.enc.Hex.parse(token.key1iv) });
    const cipherText = encryptedMessage.ciphertext.toString(CryptoJS.enc.Base64);
    this.message = cipherText;
    this.key1id = token.key1id;
  }

  generateDecryptedMessage(msg: string, token: Token) {
    let key = token.decgenkey2;
    if (key == null) {
      key = CryptoJS.PBKDF2(token.key2phrase, CryptoJS.enc.Hex.parse(token.key2salt), {
        keySize: 128 / 32,
        iterations: 10000
      });
      token.decgenkey2 = key;
    }
    const encryptedMessage = CryptoJS.AES.decrypt(msg, key, { iv: CryptoJS.enc.Hex.parse(token.key2iv) });
    const plaintext = encryptedMessage.toString(CryptoJS.enc.Utf8);
    this.message = JSON.parse(plaintext);
  }

}
