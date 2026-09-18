const { ethers } = require("hardhat");

async function main(){
  const factory = await ethers.getContractFactory("ExamRegistry");
  const myContract = await factory.deploy();
  await myContract.waitForDeployment();
  
  const testExam = ethers.id("TEST_" + Date.now());
  const randomAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  
  await (await myContract.registerPaper(testExam, "hash", 1000)).wait();
  await (await myContract.grantAccess(testExam, randomAddress)).wait();
  await (await myContract.logAccess(testExam, randomAddress)).wait();

  const fromBlock = 0;
  const toBlock = 'latest';

  const uploads = await myContract.queryFilter(myContract.filters.PaperRegistered(), fromBlock, toBlock);
  const grants = await myContract.queryFilter(myContract.filters.AccessGranted(), fromBlock, toBlock);
  const accesses = await myContract.queryFilter(myContract.filters.PaperAccessed(), fromBlock, toBlock);

  console.log("Uploads found:", uploads.length);
  console.log("Grants found:", grants.length);
  console.log("Accesses found:", accesses.length);
}

main().catch(console.error);
