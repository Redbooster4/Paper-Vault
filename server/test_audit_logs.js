require("dotenv").config();
const { getAuditLogs } = require("./src/services/blockchain.service");

getAuditLogs()
  .then(logs => console.log("Success! Logs:", logs.length))
  .catch(err => console.error("Error:", err));
