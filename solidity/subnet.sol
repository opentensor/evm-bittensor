// SPDX-License-Identifier: GPL-3.0
//
// This example demonstrates calling of ISubnet precompile
// from another smart contract

pragma solidity ^0.8.3;
import "@openzeppelin/contracts/access/Ownable.sol";

address constant ISUBTENSOR_SUBNET_ADDRESS = 0x0000000000000000000000000000000000000803;

interface ISubnet {
    /// Registers a new network without specifying details.
    // function registerNetwork() external payable;
    /// Registers a new network with specified subnet name, GitHub repository, and contact information.
    function registerNetwork(
        bytes memory subnetName,
        bytes memory githubRepo,
        bytes memory subnetContact
    ) external payable;

    function getServingRateLimit(uint16 netuid) external view returns (uint64);

    function setServingRateLimit(
        uint16 netuid,
        uint64 servingRateLimit
    ) external payable;
}

contract Subnet is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerNetwork(
        bytes memory subnetName,
        bytes memory githubRepo,
        bytes memory subnetContact
    ) external payable onlyOwner {
        ISubnet subnetPrecompile = ISubnet(ISUBTENSOR_SUBNET_ADDRESS);
        (bool success, ) = ISUBTENSOR_SUBNET_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(
                subnetPrecompile.registerNetwork.selector,
                subnetName,
                githubRepo,
                subnetContact
            )
        );
        require(success, "Subnet call failed");
    }

    function setHyperParameter(
        uint16 netuid,
        uint64 value
    ) external payable onlyOwner {
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

    function getHyperParameter(uint16 netuid) public returns (uint64) {
        ISubnet subnetPrecompile = ISubnet(ISUBTENSOR_SUBNET_ADDRESS);
        (bool success, bytes memory data) = ISUBTENSOR_SUBNET_ADDRESS.call(
            abi.encodeWithSelector(
                subnetPrecompile.getServingRateLimit.selector,
                netuid
            )
        );
        require(success, "Subnet call failed");

        uint64 value = abi.decode(data, (uint64));
        return value;
    }
}
