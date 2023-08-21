import * as fs from "fs";
import * as crypto from "crypto";
let publicKeyPath = "./publicKey.pem";
let privateKeyPath = "./privateKey.pem";
let publicKey:any;
let privateKey:any;
if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
    console.log('if case');

  publicKey = fs.readFileSync(publicKeyPath);
  privateKey = fs.readFileSync(privateKeyPath);
} else {
  const { publicKey: pub, privateKey: priv } = crypto.generateKeyPairSync(
    "rsa",
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    }

  );
  publicKey = pub;
  privateKey = priv;
   try {
      fs.writeFileSync(publicKeyPath, publicKey);
      fs.writeFileSync(privateKeyPath, privateKey);
      console.log("File successfully written!");

  } catch (error) {
  console.error("Error occurred:", error);
}
}
//}
//export default generateRSAKeys