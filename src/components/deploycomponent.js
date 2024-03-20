// import Web3 from 'web3';
// import contractABI from '../artifacts/contracts/AiToken.sol/satish.json';

// export const deployContract = async () => {
//     try {
//         if (!window.ethereum) {
//             console.error('MetaMask or Web3 provider is not available.');
//             return;
//         }

//         // Request account access if needed
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         console.log('Connected to MetaMask');

//         // Initialize Web3 with MetaMask provider
//         const web3 = new Web3(window.ethereum);

//         // Get user's connected address
//         const accounts = await web3.eth.getAccounts();
//         const userAddress = accounts[0]; // Assuming the first account is the user's address

//         console.log('Connected wallet address:', userAddress);

//         // Deploy contract
//         const contract = new web3.eth.Contract(contractABI.abi);
//         console.log(contractABI.bytecode);
//         const deployedContract = await contract.deploy({
//             data: contractABI.bytecode
//         }).send({
//             from: userAddress,
//             gas: 1500000 // Adjust gas limit as needed
//         });

//         // Set deployed address
//         console.log('Contract deployed at address:', deployedContract.options.address);
//         return deployedContract.options.address;
//     } catch (error) {
//         console.error('Error deploying contract:', error);
//         throw error;
//     }
// };
import Web3 from 'web3';



// Function to deploy contract
export const deployContract = async () => {
    try {
        if (!window.ethereum) {
            console.error('MetaMask or Web3 provider is not available.');
            return;
        }

        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected to MetaMask');

        // Initialize Web3 with MetaMask provider
        const web3 = new Web3(window.ethereum);

        // Get user's connected address
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0]; // Assuming the first account is the user's address

        console.log('Connected wallet address:', userAddress);

        // Load contract ABI dynamically
        const contractABI = await import('../artifacts/contracts/AiToken.sol/cypert.json');

        // Deploy contract
        const contract = new web3.eth.Contract(contractABI.abi);
        // console.log(contractABI.bytecode);
        const deployedContract = await contract.deploy({
            data: contractABI.bytecode,
            arguments: ["0x6DfCC67a082207D8bAc21d98B34eED0bE6365321"]
        }).send({
            from: userAddress,
            gas: 15000000 // Adjust gas limit as needed
        });

        // Set deployed address
        console.log('Contract deployed at address:', deployedContract.options.address);
        return deployedContract.options.address;
    } catch (error) {
        console.error('Error deploying contract:', error);
        throw error;
    }
};
