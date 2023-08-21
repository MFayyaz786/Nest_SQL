import * as crypto from "crypto";
import * as fs from "fs";
const publicKeyPath = "./publicKey.pem";
const privateKeyPath = "./privateKey.pem";
const blockSize = 20;
export function encryptObject(obj:object) {
    try {
    const publicKey = fs.readFileSync(publicKeyPath);
    const data = JSON.stringify(obj);
   let cipher=[];
   if(data.length<blockSize){
    // Encrypt the symmetric key with the RSA public key
     const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
        //oaepHash:"sha512"
      },
      Buffer.from(data)
    );
    cipher.push(encryptedData.toString("base64"))
   }else{
     const stringLength = (data.length / blockSize) + (data.length % blockSize != 0 ? 1 : 0);
  /// encryption
  for (let index = 0; index < stringLength; index++) {

    if (index == data.length / blockSize) {
      const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
        //oaepHash:"sha512"
      },
      Buffer.from(data)
    );
    cipher.push(encryptedData.toString("base64"))
   }else{
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
        //oaepHash:"sha512"
      },
 Buffer.from(data.substring((index * blockSize), (index + 1) * blockSize)));
cipher.push(encryptedData.toString('base64'));
   }
  }
 // const combinedCipher = cipher.join('');
    return {
      cipher: cipher,
    };
  }
} catch (error) {
    console.log(error);
    return {};
  }
}

export function decryptObject(cipher:any) {
      const privateKey = fs.readFileSync(privateKeyPath);
  const decryptedCipher = [];
  for (let index = 0; index < cipher.length; index++) {
    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(cipher[index], 'base64')
    );
    decryptedCipher.push(decryptedData);
  }
  const obj = JSON.parse(decryptedCipher.join(''));
  return obj;
}

