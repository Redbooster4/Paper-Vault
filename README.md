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
```

**Terminal 2: Deploy the Smart Contract**
*(Ensure the Hardhat node in Terminal 1 is actively running before executing this command)*
```bash
cd blockchain
npx hardhat run .\script\deploy.js --network localhost
```

**Terminal 3: Start the Backend Server**
```bash
cd server
node src/app.js
```

**Terminal 4: Launch the Frontend Application**
```bash
cd frontend
npm run dev
```
