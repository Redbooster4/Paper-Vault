const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "..", "..", "storage");
if(!fs.existsSync(STORAGE_DIR)){
  fs.mkdirSync(STORAGE_DIR);
}

function saveFile(encryptedBuffer, fileName) {
  const filePath = path.join(STORAGE_DIR, fileName);
  fs.writeFileSync(filePath, encryptedBuffer);
  return fileName;
}

function readFile(fileName) {
  const filePath = path.join(STORAGE_DIR, fileName);
  if(!fs.existsSync(filePath)){
    throw new Error("File not found in storage");
  }
  return fs.readFileSync(filePath);
}

module.exports = { saveFile, readFile };
