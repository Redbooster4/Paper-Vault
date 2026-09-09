const { ethers } = require("ethers");
const abi = require("../../contract-abi.json");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function registerPaper(examId, ipfsHash, releaseTimestamp) {
  const tx = await contract.registerPaper(examId, ipfsHash, releaseTimestamp);
  return await tx.wait();
}
async function grantAccess(examId, institutionAddress) {
  const tx = await contract.grantAccess(examId, institutionAddress);
  return await tx.wait();
}
async function checkAccess(examId, requesterAddress) {
  return await contract.checkAccess(examId, requesterAddress);
}
async function logAccess(examId, requesterAddress) {
  const tx = await contract.logAccess(examId, requesterAddress);
  return await tx.wait();
}
async function getPaper(examId) {
  const [ipfsHash, releaseTimestamp, uploadedBy] = await contract.getPaper(examId);
  return { ipfsHash, releaseTimestamp: Number(releaseTimestamp), uploadedBy };
}

module.exports = {
  registerPaper,
  grantAccess,
  checkAccess,
  logAccess,
  getPaper,
};
