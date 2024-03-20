require("@nomicfoundation/hardhat-toolbox");

// import('hardhat/config').HardhatUserConfig 

module.exports = {
  etherscan: {
    apiKey: "72FSGVQFFZRQSZF2HG8HWICASDBJC2SDKE", // You have placeholders for different networks, make sure to replace them with actual API keys
  },
  defaultNetwork: "testnet" || "hardhat", // This line seems redundant as it always selects "testnet", consider removing "hardhat" option if you're not going to use it
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1, 
      },
    },
    sourcify: {
      enabled: false,
    }
  },
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    testnet: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      chainId: 80001,
      accounts: ['555562ffdb085c5d840f7e779d11cdd5d0bff08b29b5b38166de215655922b26'],
    }
  }
};
