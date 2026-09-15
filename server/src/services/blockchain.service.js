const { ethers } = require("ethers");
const abi = require("../../contract-abi.json");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi.abi, wallet);

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

async function getAuditLogs() {
  const fromBlock = 0;
  const toBlock = 'latest';

  const uploads = await contract.queryFilter(contract.filters.PaperRegistered(), fromBlock, toBlock);
  const grants = await contract.queryFilter(contract.filters.AccessGranted(), fromBlock, toBlock);
  const accesses = await contract.queryFilter(contract.filters.PaperAccessed(), fromBlock, toBlock);

  const logs = [];
  uploads.forEach(log => logs.push({ type: 'UPLOAD', examId: log.args[0], info: `Hash: ${log.args[1]}`, tx: log.transactionHash, block: log.blockNumber }));
  grants.forEach(log => logs.push({ type: 'GRANT', examId: log.args[0], info: `Granted to: ${log.args[1]}`, tx: log.transactionHash, block: log.blockNumber }));
  accesses.forEach(log => logs.push({ type: 'ACCESS', examId: log.args[0], info: `Accessed by: ${log.args[1]}`, tx: log.transactionHash, block: log.blockNumber }));
  
  return logs.sort((a, b) => b.block - a.block);
}

module.exports = {
  registerPaper,
  grantAccess,
  checkAccess,
  logAccess,
  getPaper,
  getAuditLogs,
};
