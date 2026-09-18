import { network } from "hardhat";

async function main(){
  const { ethers } = await network.connect();
  const myContract = await ethers.getContractAt("ExamRegistry", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const testExam = ethers.id("Math101");

  const hasAccess = await myContract.checkAccess(testExam, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  console.log("Does student have access?", hasAccess);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
