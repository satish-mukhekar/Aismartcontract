// backend/compile.js

const express = require('express');
const { exec } = require('child_process');
const cors = require('cors'); // Import the 'cors' middleware

const app = express();
const port = 3001; // Choose a port for your server

// Enable CORS for all routes
app.use(cors());

// Define a route to handle compilation
app.get('/compile', (req, res) => {
    // Execute the 'npx hardhat compile' command
    exec('npx hardhat compile', (error, stdout, stderr) => {
        if (error) {
            console.error('Error compiling contract:', error);
            res.status(500).json({ error: 'Failed to compile contract' });
            return;
        }
        console.log('Compilation output:', stdout);
        res.status(200).json({ message: 'Contract compiled successfully', output: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});