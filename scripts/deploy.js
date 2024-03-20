// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

/**
 * Main function that deploys the PropertyNFT contract and logs the deployment address.
 */
async function main() {
  // Deploy the Evc contract
  const AIDeploy = await hre.ethers.deployContract("AiToken");
  // npx hardhat run --network testnet scripts/deployEvc.js
  // npx hardhat verify --network testnet 0xc6Eeb939389a3BDADc8A552526479B67cae75b54 {evccontractAddress}
  // npx hardhat verify --contract contracts/EvcToken.sol:EvcToken 0x6a0A34E693DE165534C0786379d0440E99F05519

  console.log(`deployed to ${AIDeploy.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
