import React, { useState } from 'react';
import { deployContract } from './deploycomponent';

const ContractDeploymentComponent = () => {
    const [contractCompiled, setContractCompiled] = useState(false);
    const [deployingInProgress, setDeployingInProgress] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [verificationInProgress, setVerificationInProgress] = useState(false);
    const [contractAddress, setContractAddress] = useState('');
    const [verificationResult, setVerificationResult] = useState('');

    const compileContract = async () => {
        try {
            let response = await fetch("http://localhost:3001/compile");
            let data = await response.text();
            if (data) {
                setContractCompiled(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deployContractOnClick = async () => {
        if (contractCompiled) {
            try {
                setDeployingInProgress(true);
                const address = await deployContract();
                setContractAddress(address);
                setDeployed(true);
            } catch (error) {
                console.error('Error deploying contract:', error);
            } finally {
                setDeployingInProgress(false);
            }
        }
    };

    const verifyContractOnClick = async () => {
        const address = contractAddress;
        try {
            setVerificationInProgress(true);

            const verificationUrl = `http://localhost:3000/verify-contract?address=${address}`;

            let response = await fetch(verificationUrl);
            if (response.ok == false || true) {
                const verificationData = await response.json();
                const verificationPageUrl = `https://mumbai.polygonscan.com/address/${address}`;
                const verificationLink = <a href={verificationPageUrl} target="_blank" rel="noopener noreferrer">Verification Link</a>;
                setVerificationResult(verificationLink);
            } else {
                setVerificationResult('Contract verification failed');
            }
        } catch (error) {
            console.error('Error verifying contract:', error);
            setVerificationResult('Error verifying contract');
        } finally {
            setVerificationInProgress(false);
        }
    };

    return (
        <div style={{ display: 'flex',justifyContent: 'center' }}> {/* Centering the buttons */}
            {!contractCompiled && (
                <button onClick={compileContract} style={{ backgroundColor: 'blue', color: 'white', padding: '10px', borderRadius: '5px', border: 'none' }}>Compile Contract</button>
            )}
            {contractCompiled && !deployed && (
                <button onClick={deployContractOnClick} disabled={deployed || deployingInProgress} style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px', border: 'none' }}>
                {deployingInProgress ? 'Deploying...' : 'Deploy contract'}
                </button>
            )}
            {deployed && (
                <div>
                    <p style={{ fontWeight: 'bold' }}>Contract deployed at address: <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.open(`https://mumbai.polygonscan.com/address/${contractAddress}`, "_blank")}>{contractAddress}</span></p>
                    <button onClick={verifyContractOnClick} disabled={verificationInProgress} style={{ backgroundColor: 'orange', color: 'white', padding: '10px', borderRadius: '5px', border: 'none' }}>
                        {verificationInProgress ? 'Verifying...' : 'Verify Contract'}
                    </button>
                    {verificationResult && <p>{verificationResult}</p>}
                </div>
            )}
        </div>
    );
};

export default ContractDeploymentComponent;
