const express=require("express");
const multer=require("multer");
const{ ethers } = require("ethers");
const router=express.Router();

const{ encryptFile, decryptFile }=require("../services/crypto.service");
const{ saveFile, readFile }=require("../services/storage.service");
const{
  registerPaper,
  grantAccess,
  checkAccess,
  logAccess,
  getPaper,
  getAuditLogs,
}=require("../services/blockchain.service");
const { addPaper } = require("../services/registry.service");

const upload=multer();
router.post("/upload", upload.single("paper"), async(req, res) => {
  try{
    const{ examName, timeStamp } = req.body;
    if(!req.file || !examName || !timeStamp){
      return res.status(400).json({ 
        error: "Paper+name+timestamp are required" });
    }

    const examId=ethers.id(examName);
    const encrypted=encryptFile(req.file.buffer);
    const fileName=`${examId}.enc`;
    saveFile(encrypted, fileName);
    await registerPaper(examId, fileName, timeStamp);
    addPaper(examId, examName, timeStamp);

    res.json({ success: true, examId, storedAs: fileName });
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/grant-access", async(req, res) => {
  try{
    const{ examName, address }=req.body;
    const examId = ethers.id(examName);
    await grantAccess(examId, address);
    res.json({ success: true });
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/retrieve/:examName/:address", async(req, res) => {
  try{
    const{ examName, address } = req.params;
    const examId = ethers.id(examName);

    const allowed=await checkAccess(examId, address);
    if(!allowed){
      return res.status(403).json({ 
        error: "Not authorized" 
      });
    }
    const paper=await getPaper(examId);
    const encrypted=readFile(paper.ipfsHash);
    const decrypted=decryptFile(encrypted);

    await logAccess(examId, address);
    res.set("Content-Type", "application/pdf");
    res.send(decrypted);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/info/:examName", async(req, res) => {
  try{
    const examId=ethers.id(req.params.examName);
    const paper=await getPaper(examId);
    res.json(paper);
  } 
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

router.get("/audit-logs", async(req, res) => {
  try{
    const logs=await getAuditLogs();
    res.json(logs);
  } 
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;