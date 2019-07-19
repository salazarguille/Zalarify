pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "./base/proxy/ProxyBase.sol";

/**
    @notice It is the entry point for the Zalarify platform.
    @dev It is a proxy which delegates the calls to another smart contract.
    @author Guillermo Salazar.
 */
contract Zalarify is ProxyBase {
    
    /** Constants */
    string constant public ZALARIFY = "ZalarifyBase";

    /** Variables */

    /** Events */

    /** Modifiers */

    /** Constructor */

    /**
        @notice It creates a new Role instance associated to an Eternal Storage implementation.
        @param storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address storageAddress)
      ProxyBase(storageAddress, ZALARIFY)
      public {
    }

    /**
        @notice ERC897, the address the proxy would delegate calls to
        @return the address which it delegates the calls to.
     */
    function implementation() public view returns (address) {
        return getTargetAddress(targetId);
    }

    /**
        @dev ERC897, whether it is a forwarding (1) or an upgradeable (2) proxy
        @return 1 if it is a forwarding proxy. Otherwise it returns 2.
     */
    function proxyType() public pure returns (uint256 proxyTypeId) {
        return UPGRADEABLE;
    }
}