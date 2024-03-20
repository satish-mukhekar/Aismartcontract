const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Define a route to trigger Hardhat command
app.get('/verify-contract', (req, res) => {
  const contractAddress = req.query.address;

  if (!contractAddress) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  const command = `npx hardhat verify --network testnet ${contractAddress} "0x6DfCC67a082207D8bAc21d98B34eED0bE6365321"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    console.log(`stdout: ${stdout}`);
    res.status(200).json({ message: 'Verification successful', output: stdout });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
