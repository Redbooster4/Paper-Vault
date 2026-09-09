import "dotenv/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatEthers],

  solidity: "0.8.20",

  networks: {
    sepolia: {
      type: "http",
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
});
