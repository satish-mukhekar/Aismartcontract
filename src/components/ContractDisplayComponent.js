import React, { useState } from 'react';
import './styles.css'; // Import the CSS file

const ContractDisplayComponent = () => {
    const [selectedOptions, setSelectedOptions] = useState({
        mintable: false,
        burnable: false,
        pausable: false,
        permit: false,
        votes: false,
        flashMinting: false,
        maxAmountPerWallet: false,
        maxTransactionPerSecond: false,
    });

    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [Initialsupply,sethandleInitialsupply] = useState("");
    const [owner, setOwner] = useState("");
    const [maxAmountPerWalletValue, setMaxAmountPerWalletValue] = useState(""); // State for max amount per wallet
    const [maxTransactionPerSecondValue, setMaxTransactionPerSecondValue] = useState(""); // State for max transaction per second

    const handleCheckboxChange = (option) => {
        setSelectedOptions({
            ...selectedOptions,
            [option]: !selectedOptions[option],
        });
        if (option === 'maxAmountPerWallet') {
            setMaxAmountPerWalletValue(""); // Reset the maxAmountPerWallet state when checkbox is unchecked
        }
        if (option === 'maxTransactionPerSecond') {
            setMaxTransactionPerSecondValue(""); // Reset the maxTransactionPerSecond state when checkbox is unchecked
        }
    };

    const handleTokenNameChange = (event) => {
        setTokenName(event.target.value);
    };

    const handleTokenSymbolChange = (event) => {
        setTokenSymbol(event.target.value);
    };
    const handleInitialsupply = (event)=> {
        sethandleInitialsupply(event.target.value);    
    };

    const handleOwnerChange = (event) => {
        setOwner(event.target.value);
    };

    const handleMaxAmountPerWalletChange = (event) => {
        setMaxAmountPerWalletValue(event.target.value);
    };

    const handleMaxTransactionPerSecondChange = (event) => {
        setMaxTransactionPerSecondValue(event.target.value);
    };

    const generateSolidityCode = () => {
        let solidityCode = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.20;

  import "@openzeppelin/contracts/token/ERC20/ERC20.sol";`;

        const additionalImports = [];
        const contractExtensions = [];

        if (selectedOptions.mintable || selectedOptions.pausable || selectedOptions.permit) {
            additionalImports.push('"@openzeppelin/contracts/access/Ownable.sol"');
            contractExtensions.push('Ownable');
        }
        if (selectedOptions.burnable) {
            additionalImports.push('"@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol"');
            contractExtensions.push('ERC20Burnable');
        }
        if (selectedOptions.pausable) {
            additionalImports.push('"@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol"');
            contractExtensions.push('ERC20Pausable');
        }
        if (selectedOptions.permit || selectedOptions.votes) {
            additionalImports.push('"@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol"');
            contractExtensions.push('ERC20Permit');
        }
        if (selectedOptions.votes) {
            additionalImports.push('"@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol"');
            contractExtensions.push('ERC20Votes');
        }
        if (selectedOptions.flashMinting) {
            additionalImports.push('"@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol"');
            contractExtensions.push('ERC20FlashMint');
        }
        if (additionalImports.length > 0) {
            solidityCode += '\nimport ' + additionalImports.join(';\nimport ') + ';';
        }

        solidityCode += `\n\ncontract ${tokenName} is ERC20`;

        if (contractExtensions.length > 0) {
            solidityCode += `, ${contractExtensions.join(', ')}`;
        }

        solidityCode += ' {\n';

        if (selectedOptions.maxAmountPerWallet) {
            solidityCode += `\n uint256 private _maxWalletAmount = ${maxAmountPerWalletValue};`;
        }

        if (selectedOptions.maxTransactionPerSecond) {
            solidityCode += `\n uint256 private _maxTransactionPerSecond = ${maxTransactionPerSecondValue};
            mapping(address => uint256) private _lastTransactionTime;`;
        }

        solidityCode += `\n\nconstructor(address _owner) ERC20("${tokenName}", "${tokenSymbol}")`;

        if (selectedOptions.mintable || selectedOptions.pausable) {
            solidityCode += `\n    Ownable(_owner)`;
        }
        if (selectedOptions.Initialsupply){
            solidityCode += `_mint(msg.sender, initialSupply_);
            _maxSupply = maxSupply_ `;
        }

        if (selectedOptions.permit || selectedOptions.votes) {
            solidityCode += `\n    ERC20Permit("${tokenName}")`;
        }

        solidityCode += '\n{';

        if (selectedOptions.maxAmountPerWallet) {
            solidityCode += `\n _maxWalletAmount = ${maxAmountPerWalletValue};`;
        }
        if (selectedOptions.maxTransactionPerSecond) {
            solidityCode += `\n _maxTransactionPerSecond = ${maxTransactionPerSecondValue};`;
        }

        solidityCode += '\n}';

        if (selectedOptions.mintable) {
            solidityCode += '\n\nfunction mint(address to, uint256 amount) public onlyOwner {\n_mint(to, amount);\n}';
        }

        if (selectedOptions.pausable && !selectedOptions.votes) {
            solidityCode += `
            function pause() public onlyOwner {
                _pause();
            }
        
            function unpause() public onlyOwner {
                _unpause();
            }
            
            // The following functions are overrides required by Solidity.
        
            function _update(address from, address to, uint256 value)
                internal
                override(ERC20, ERC20Pausable)
            {
                super._update(from, to, value);
            }`;
        }

        if (!selectedOptions.pausable && selectedOptions.votes) {
            solidityCode += `
            function _update(address from, address to, uint256 value)
            internal
            override(ERC20, ERC20Votes)
        {
            super._update(from, to, value);
        }
    
        function nonces(address owner)
            public
            view
            override(ERC20Permit, Nonces)
            returns (uint256)
        {
            return super.nonces(owner);
        }`;
        }

        if (selectedOptions.votes && selectedOptions.pausable && selectedOptions.maxAmountPerWallet) {
            solidityCode += `
    function maxWalletAmount() public view returns (uint256) {
        return _maxWalletAmount;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20,ERC20Votes,ERC20Pausable)
    {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0) && to != address(0)) {
            require(amount <= _maxTransactionAmount, "Exceeds maximum transaction amount");
        }
        if (from != address(0)) {
            require(balanceOf(to).add(amount) <= _maxWalletAmount, "Exceeds maximum wallet amount");
        }
    }
        }`;
        }

        if (selectedOptions.pausable && selectedOptions.votes) {
            solidityCode += `
            function pause() public onlyOwner {
                _pause();
            }
        
            function unpause() public onlyOwner {
                _unpause();
            }
        
            // The following functions are overrides required by Solidity.
        
            function _update(address from, address to, uint256 value)
                internal
                override(ERC20, ERC20Pausable, ERC20Votes)
            {
                super._update(from, to, value);
            }
        
            function nonces(address owner)
                public
                view
                override(ERC20Permit, Nonces)
                returns (uint256)
            {
                return super.nonces(owner);
            }`;

        }
        solidityCode += `
}`;

        return solidityCode;
    };

    const handleDownload = () => {
        const solidityCode = generateSolidityCode();
        console.log(solidityCode,"response")
        const element = document.createElement('a');
        const file = new Blob([solidityCode], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'AiToken.sol';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="container">
            <h2>Generate Solidity Contract</h2>
            <div>
                <label className="label">
                    TOKEN NAME:
                    <input
                        type="text"
                        value={tokenName}
                        onChange={handleTokenNameChange}
                        className="input"
                    />
                </label>
                <label className="label">
                    TOKEN SYMBOL:
                    <input
                        type="text"
                        value={tokenSymbol}
                        onChange={handleTokenSymbolChange}
                        className="input"
                    />
                </label>
                <label className="label">
                INITIAL SUPPLY:
                    <input
                        type="text"
                        value={Initialsupply}
                        onChange={handleInitialsupply}
                        className="input"
                    />
                </label>
                <label className="label">
                    OWNER ADDRESS:
                    <input
                        type="text"
                        value={owner}
                        onChange={handleOwnerChange}
                        className="input"
                    />
                </label>
                {Object.keys(selectedOptions).map((option, index) => (
                    <label key={index} className="checkbox-label">
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                        <input
                            type="checkbox"
                            checked={selectedOptions[option]}
                            onChange={() => handleCheckboxChange(option)}
                            className="input"
                        />
                    </label>
                ))}
                {selectedOptions.maxAmountPerWallet && (
                    <div className="label">
                        Max Amount per Wallet:
                        <input
                            type="number"
                            value={maxAmountPerWalletValue}
                            onChange={handleMaxAmountPerWalletChange}
                            className="input"
                        />
                    </div>
                )}
                {selectedOptions.maxTransactionPerSecond && (
                    <div className="label">
                        Max Transaction per Second:
                        <input
                            type="number"
                            value={maxTransactionPerSecondValue}
                            onChange={handleMaxTransactionPerSecondChange}
                            className="input"
                        />
                    </div>
                )}
            </div>
            <div>
                <button onClick={handleDownload} className="button">Download Solidity File</button>
            </div>
        </div>
    );
};

export default ContractDisplayComponent;
