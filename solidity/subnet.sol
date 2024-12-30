// SPDX-License-Identifier: GPL-3.0
//
// This example demonstrates calling of ISubnet precompile
// from another smart contract

pragma solidity ^0.8.3;

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

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != msg.sender) {
            revert OwnableUnauthorizedAccount(msg.sender);
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
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
