pragma solidity 0.5.3;

import "../services/erc20/ERC20.sol";
import "./Base.sol";
import "../interface/IVault.sol";

contract Vault is Base, IVault {
    
    /** Constants */

    /** Variables */

    /** Modifiers */

    /** Constructor */
    constructor(address _storage)
      Base(_storage)
      public {
    }

    /** Fallback Method */

    function () external payable {
        require(msg.value > 0, "Msg value > 0.");
        emit DepositReceived(
            address(this),
            msg.sender,
            msg.value
        );
    }

    /** Functions */

    function deposit()
      payable
      external
      returns (bool){
        require(msg.value > 0, "Msg value > 0.");
        emit DepositReceived(address(this), msg.sender, msg.value);
        return true;
    }

    function hasBalanceInErc(address _contractAddress, address _anAddress, uint256 _amount)
      internal
      view
      returns (bool _hasBalance) {
        return ERC20(_contractAddress).balanceOf(_anAddress) >= _amount;
    }

    function transferTokens(address _tokenAddress, address _toAddress, uint256 _amount)
      external
      onlySuperUser()
      nonReentrant()
      returns (bool)
      {
      require(hasBalanceInErc(_tokenAddress, address(this), _amount), "Contract has not enough tokens balance.");
      bool transferResult = ERC20(_tokenAddress).transfer(_toAddress, _amount);
      require(transferResult, "Transfer tokens was invalid.");

      emit TokensWithdrawn (
        address(this),
        _tokenAddress,
        msg.sender,
        _toAddress,
        _amount
      );
      return true;
    }

    function transferEthers(address payable _toAddress, uint256 _amount)
      external
      onlySuperUser()
      nonReentrant()
      returns (bool)
      {
      require(address(this).balance >= _amount, "Contract has not enough balance.");
      
      _toAddress.transfer(_amount);
      
      emit EthersWithdrawn (
        address(this),
        msg.sender,
        _toAddress,
        _amount
      );
      return true;
    }
}