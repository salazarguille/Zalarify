pragma solidity 0.5.3;

import "../Base.sol";
import "./DelegateProxy.sol";

/**
    @title This is a Proxy base contract.
    @author Guillermo Salazar
    @dev It implements a fallback function to invoke the delegate call.
 */
contract ProxyBase is DelegateProxy, Base {

    string public targetId;

    /**
        @notice It creates a new ProxyBase instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @param aTargetId the smart contract name to delegate the calls.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress, string memory aTargetId) public Base(_storageAddress) {
        targetId = aTargetId;
    }

    /**
        @notice The fallback function where the call are delegated.
     */
    function () external payable {
        address target = getTargetAddress(targetId);
        require(target != address(0x0), "Target address != 0x0"); // if contract code hasn't been set yet, don't call
        delegatedFwd(target, msg.data);
    }

    /**
        @notice It gets the target id value.
        @return the target id.
     */
    function getTargetId() external view returns (string memory) {
        return targetId;
    }

    /**
        @notice It gets the target address associated to a target id.
        @param aTargetId the target id values associated to a contract address.
        @return the target address associated to a target id.
     */
    function getTargetAddress(string memory aTargetId) internal view returns (address) {
        return _storage.getAddress(keccak256(abi.encodePacked(CONTRACT_NAME, aTargetId)));
    }

    /**
        @notice It transfers a specific amount of ether to a specific address.
        @param toAddress where the Ether will be transfered.
        @param amount amount of Ether to transfer.
        @return true if the transfer is done. Otherwise it returns false.
     */
    function transferEthers(address payable toAddress, uint256 amount)
      external
      onlySuperUser()
      nonReentrant()
      returns (bool)
      {
      require(address(this).balance >= amount, "Contract has not enough balance.");
      
      toAddress.transfer(amount);

      return true;
    }
}