// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract cypert is ERC20, Ownable, ERC20Burnable, ERC20Pausable, ERC20Permit, ERC20Votes, ERC20FlashMint {


constructor(address _owner) ERC20("cypert", "cypt")
    Ownable(_owner)
    ERC20Permit("cypert")
{
}

function mint(address to, uint256 amount) public onlyOwner {
_mint(to, amount);
}
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
            }
}