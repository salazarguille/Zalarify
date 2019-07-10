pragma solidity 0.5.3;

import "../../base/proxy/DelegateProxy.sol";

contract DelegateProxyMock is DelegateProxy {
    
    /** Constants */

    /** Variables */
    address public target;

    /** Events */

    /** Modifiers */

    /** Constructor */
    constructor(address _target) public DelegateProxy() {
        target = _target;
    }

    /**
    * @dev ERC897, the address the proxy would delegate calls to
    */
    function implementation() public view returns (address) {
        return target;
    }

    /**
     * @dev ERC897, whether it is a forwarding (1) or an upgradeable (2) proxy
     */
    function proxyType() public pure returns (uint256 proxyTypeId) {
        return UPGRADEABLE;
    }

    function () external payable {
        delegatedFwd(target, msg.data);
    }
}