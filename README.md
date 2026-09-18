# Blockchain Paper Vault

## Key Project Components
* **`server/routes/`**: Contains the API routing logic that bridges the frontend client with the backend services and blockchain network.
* **`contract-abi.json`**: The Application Binary Interface (ABI) necessary for the application to understand and interact with the deployed smart contract functions.

## Local Deployment Guide

To launch the full application stack, you will need to run the following commands concurrently across four separate terminal instances. 

**Terminal 1: Initialize the Local Blockchain Node**
```bash
cd blockchain
npx hardhat node