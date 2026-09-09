const express = require("express");
const multer = require("multer");
const { ethers } = require("ethers");
const router = express.Router();
const upload = multer();

const { encryptFile, decryptFile } = require("../services/crypto.service");
const { saveFile, readFile } = require("../services/storage.service");
const {
  registerPaper,
  grantAccess,
  checkAccess,
  logAccess,
  getPaper,
} = require("../services/blockchain.service");

// Exam board uploads a paper
router.post("/upload", upload.single("paper"), async (req, res) => {
  try {
    const { examName, releaseTimestamp } = req.body;
    if (!req.file || !examName || !releaseTimestamp) {
      return res.status(400).json({ error: "paper, examName, releaseTimestamp are required" });
    }

    const examId = ethers.id(examName);
    const encrypted = encryptFile(req.file.buffer);
    const fileName = `${examId}.enc`;
    saveFile(encrypted, fileName);

    await registerPaper(examId, fileName, releaseTimestamp);

    res.json({ success: true, examId, storedAs: fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Exam board grants a student/institution access
router.post("/grant-access", async (req, res) => {
  try {
    const { examName, address } = req.body;
    const examId = ethers.id(examName);
    await grantAccess(examId, address);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Student/institution requests the paper
router.get("/retrieve/:examName/:address", async (req, res) => {
  try {
    const { examName, address } = req.params;
    const examId = ethers.id(examName);

    const allowed = await checkAccess(examId, address);
    if (!allowed) {
      return res.status(403).json({ error: "Not authorized or not yet released" });
    }

    const paper = await getPaper(examId);
    const encrypted = readFile(paper.ipfsHash); // fileName stored in place of a real IPFS hash
    const decrypted = decryptFile(encrypted);

    await logAccess(examId, address);

    res.set("Content-Type", "application/pdf");
    res.send(decrypted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Read paper metadata (no file, just chain data)
router.get("/info/:examName", async (req, res) => {
  try {
    const examId = ethers.id(req.params.examName);
    const paper = await getPaper(examId);
    res.json(paper);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
