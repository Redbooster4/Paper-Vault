import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const ExamRegistry = await ethers.getContractFactory("ExamRegistry");
  const contract = await ExamRegistry.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("Contract Deployed To:", address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
