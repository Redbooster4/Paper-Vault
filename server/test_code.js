require("dotenv").config();
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
provider.getCode(process.env.CONTRACT_ADDRESS).then(console.log).catch(console.error);
