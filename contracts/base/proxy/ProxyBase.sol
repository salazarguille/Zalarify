pragma solidity 0.5.3;

import "../Base.sol";
import "./DelegateProxy.sol";
import "../../interface/IStorage.sol";

contract ProxyBase is DelegateProxy, Base {

    string public targetId;

    constructor(address _storageAddress, string memory aTargetId) public Base(_storageAddress) {
        targetId = aTargetId;
    }

    function () external payable {
        address target = getTargetAddress(targetId);
        require(target != address(0x0), "Target address != 0x0"); // if contract code hasn't been set yet, don't call
        delegatedFwd(target, msg.data);
    }

    function getTargetId() external view returns (string memory) {
        return targetId;
    }

    function getTargetAddress(string memory aTargetId) internal view returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, aTargetId)));
    }
}