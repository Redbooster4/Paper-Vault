const crypto=require("crypto");
require("dotenv").config();

function encryptFile(buffer){
  const key=Buffer.from(process.env.AES_KEY, "hex");
  const iv=crypto.randomBytes(16);
  const cipher=crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted=Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}
//here cbc is for chaining (XOR with prev ciphertext block)
function decryptFile(buffer){
  const key=Buffer.from(process.env.AES_KEY, "hex");
  const iv=buffer.subarray(0, 16);
  const data=buffer.subarray(16);
  const decipher=crypto.createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

module.exports ={ encryptFile, decryptFile };