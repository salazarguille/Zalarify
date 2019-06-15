pragma solidity 0.5.9;

import "../Base.sol";
import "./DelegateProxy.sol";
import "../../interface/IStorage.sol";

contract ProxyBase is DelegateProxy, Base {

    string public targetId;

    constructor(address _storage, string memory _targetId) public Base(_storage) {
        targetId = _targetId;
    }

    function () external payable {
        address target = getTargetAddress(targetId);
        require(target != address(0x0), "Target address != 0x0"); // if contract code hasn't been set yet, don't call
        delegatedFwd(target, msg.data);
    }

    function getTargetId() external view returns (string memory) {
        return targetId;
    }

    function getTargetAddress(string memory _targetId) internal view returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, _targetId)));
    }
}