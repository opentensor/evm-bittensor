// SPDX-License-Identifier: GPL-3.0
//
// This example demonstrates calling of IStaking precompile
// from another smart contract

pragma solidity ^0.8.3;

address constant ISUBTENSOR_STAKING_ADDRESS = 0x0000000000000000000000000000000000000801;

address constant ISUBTENSOR_SUBNET_ADDRESS = 0x0000000000000000000000000000000000000803;

bytes32 constant HOTKEY = 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d;

interface IStaking {
    function addStake(bytes32 hotkey) external payable;
    function removeStake(bytes32 hotkey, uint256 amount) external;
}

interface ISubnet {
    /// Registers a new network without specifying details.
    function registerNetwork() external payable;
    /// Registers a new network with specified subnet name, GitHub repository, and contact information.
    // function registerNetwork(
    //     bytes memory subnetName,
    //     bytes memory githubRepo,
    //     bytes memory subnetContact
    // ) external payable;

    function getServingRateLimit(uint16 netuid) external view returns (uint64);

    function setServingRateLimit(
        uint16 netuid,
        uint64 servingRateLimit
    ) external payable;
}

/*
Create a subnet
Set some hyperparameters
Wait for subnet epoch and show that owner address received subnet owner cut
*/

contract Subnet {
    function registerNetwork() external payable {
        ISubnet subnetPrecompile = ISubnet(ISUBTENSOR_SUBNET_ADDRESS);

        (bool success, ) = ISUBTENSOR_SUBNET_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(subnetPrecompile.registerNetwork.selector)
        );
        require(success, "Subnet call failed");
    }

    function setHyperParameter(uint16 netuid, uint64 value) external {
        ISubnet subnetPrecompile = ISubnet(ISUBTENSOR_SUBNET_ADDRESS);
        (bool success, ) = ISUBTENSOR_SUBNET_ADDRESS.call(
            abi.encodeWithSelector(
                subnetPrecompile.setServingRateLimit.selector,
                netuid,
                value
            )
        );
        require(success, "Subnet call failed");
    }

    // function getHyperParameter(uint16 netuid) public view returns (uint64) {
    //     ISubnet subnetPrecompile = ISubnet(ISUBTENSOR_SUBNET_ADDRESS);
    //     uint64 value = subnetPrecompile.getServingRateLimit(netuid);
    //     return value;
    // }
}
