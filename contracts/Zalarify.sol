pragma solidity 0.5.9;

import "./base/proxy/ProxyBase.sol";

contract Zalarify is ProxyBase {
    
    /** Constants */
    string constant public ZALARIFY = "ZalarifyBase";

    /** Variables */

    /** Events */

    /** Modifiers */

    /** Constructor */
    constructor(address _storage)
      ProxyBase(_storage, ZALARIFY)
      public {
    }

    /**
    * @dev ERC897, the address the proxy would delegate calls to
    */
    function implementation() public view returns (address) {
        return getTargetAddress(targetId);
    }

    /**
     * @dev ERC897, whether it is a forwarding (1) or an upgradeable (2) proxy
     */
    function proxyType() public pure returns (uint256 proxyTypeId) {
        return UPGRADEABLE;
    }
}