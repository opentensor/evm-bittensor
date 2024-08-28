// SPDX-License-Identifier: GPL-3.0
// 
// This example demonstrates calling of ISubtensorBalanceTransfer precompile 
// from another smart contract

pragma solidity ^0.8.0;

address constant ISUBTENSOR_BALANCE_TRANSFER_ADDRESS = 0x0000000000000000000000000000000000000800;

interface ISubtensorBalanceTransfer {
    function transfer(bytes32 data) external payable;
}

contract Transfer {
    function transfer_all_to_one() external payable {
        bytes4 selector = bytes4(keccak256("transfer(bytes32)"));
        uint value = msg.value;
        assembly {
            let ptr := mload(0x40)  // Load the free memory pointer
            mstore(ptr, selector)   // Store the function selector
            mstore(add(ptr, 0x04), 0xdc84503cd7f06da23828bf915f198ea549d0d4f4398c32c4d84154e819a8c23b) // Store the first argument right after the selector

            let result := call(
                gas(),     // Forward all available gas
                ISUBTENSOR_BALANCE_TRANSFER_ADDRESS,    // Address of the contract to call
                value,     // Forward all TAO
                ptr,       // Arguments start here in memory
                0x24,      // Length of data in memory (selector + uint256 argument)
                0,         // Write output over here in memory
                0          // Output size is 0 since we do not expect return data
            )

            // Check whether the call was successful and revert if not
            if iszero(result) {
                revert(0, 0)
            }
        }
    }
}