import { network } from "hardhat";

async function main(){
  const { ethers } = await network.connect();
  const myContract = await ethers.getContractAt("ExamRegistry", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
  const testExam = ethers.id("TEST_EXAM_" + Date.now());
  const studentWallet = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const adminWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  const releaseTime = Math.floor(Date.now() / 1000) - 100; // Past

  console.log("Registering paper...");
  const tx1 = await myContract.registerPaper(testExam, "fake_ipfs_hash.enc", releaseTime);
  await tx1.wait();

  console.log("Checking Admin access (without granting):", await myContract.checkAccess(testExam, adminWallet));
  console.log("Checking Student access (without granting):", await myContract.checkAccess(testExam, studentWallet));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
