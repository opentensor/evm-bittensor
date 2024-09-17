// SPDX-License-Identifier: GPL-3.0
// 
// This example demonstrates calling of ISubtensorBalanceTransfer precompile 
// from another smart contract

pragma solidity ^0.8.0;

address constant ISUBTENSOR_BALANCE_TRANSFER_ADDRESS = 0x0000000000000000000000000000000000000800;
bytes32 constant ALICE = 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d;

interface ISubtensorBalanceTransfer {
    function transfer(bytes32 data) external payable;
}

contract Transfer {
    function transfer_all_to_one() external payable {
        ISubtensorBalanceTransfer btPrecompile = ISubtensorBalanceTransfer(ISUBTENSOR_BALANCE_TRANSFER_ADDRESS);
        (bool success, ) = ISUBTENSOR_BALANCE_TRANSFER_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(btPrecompile.transfer.selector, ALICE)
        );
        require(success, "Balance transfer call failed");
    }
}
