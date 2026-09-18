import { network } from "hardhat";

async function main(){
  const { ethers } = await network.connect();
  // We don't have the contract address unless we deploy it in this script or have the node running.
  // I'll deploy it fresh.
  const factory = await ethers.getContractFactory("ExamRegistry");
  const myContract = await factory.deploy();
  await myContract.waitForDeployment();
  const address = await myContract.getAddress();
  
  const testExam = ethers.id("TEST_" + Date.now());
  const randomAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  
  console.log("Access before upload:", await myContract.checkAccess(testExam, randomAddress));

  const tx = await myContract.registerPaper(testExam, "hash", 1000);
  await tx.wait();

  console.log("Access without grant:", await myContract.checkAccess(testExam, randomAddress));

  const tx2 = await myContract.grantAccess(testExam, randomAddress);
  await tx2.wait();

  console.log("Access after grant:", await myContract.checkAccess(testExam, randomAddress));
}

main().catch(console.error);
