// SPDX-License-Identifier: GPL-3.0
// 
// This example demonstrates calling of ISubtensorBalanceTransfer precompile 
// from another smart contract

pragma solidity ^0.8.0;

address constant ISUBTENSOR_STAKING_ADDRESS = 0x0000000000000000000000000000000000000801;

interface IStaking {
    function addStake(bytes32 hotkey) external payable;
    function removeStake(bytes32 hotkey, uint64 amount) external payable;
}

contract Stake {
    function stake_from_this_contract_to_alice() external payable {
        bytes4 selector = bytes4(keccak256("addStake(bytes32)"));
        uint value = msg.value;
        assembly {
            let ptr := mload(0x40)  // Load the free memory pointer
            mstore(ptr, selector)   // Store the function selector
            mstore(add(ptr, 0x04), 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d) // Store the first argument right after the selector

            let result := call(
                gas(),     // Forward all available gas
                ISUBTENSOR_STAKING_ADDRESS,    // Address of the contract to call
                value,     // Forward all TAO
                ptr,       // Arguments start here in memory
                0x24,      // Length of data in memory (selector + bytes32 argument)
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
