pragma solidity 0.5.3;

import "../services/erc20/ERC20.sol";
import "./Base.sol";
import "../interface/IVault.sol";

/**
    @title This manages the Ether transferred to any smart contract. 
    @notice It is used as a Vault because any smart contract transfer the ether to this smart contract.
    @author Guillermo Salazar
 */
contract Vault is Base, IVault {
    
    /** Constants */

    /** Variables */

    /** Modifiers */

    /** Constructor */

    /**
        @notice It creates a new Vault instance associated to an Eternal Storage implementation.
        @param _storage the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storage)
      Base(_storage)
      public {
    }

    /** Fallback Method */

    /**
      @notice It receives the ether transferred.
      @dev If the ether is zero, it throws a require error.
     */
    function () external payable {
        require(msg.value > 0, "Msg value > 0.");
        emit DepositReceived(
            address(this),
            msg.sender,
            msg.value
        );
    }

    /** Functions */

    /**
      @notice It is used to deposit ether to the Vault by default.
      @dev This function is used by the Base smart contract in the fallback function to transfer any ether received.
      @return true if it received the ether transferred. Otherwise it returns false.
     */
    function deposit()
      payable
      external
      returns (bool){
        require(msg.value > 0, "Msg value > 0.");
        emit DepositReceived(address(this), msg.sender, msg.value);
        return true;
    }

    /**
      @notice It verifies if a specific address has more than a specific amount of tokens in a specific ERC20 token.
      @param _contractAddress ERC20 token address.
      @param _anAddress address to verify the balance.
      @param _amount the minimum amount of token to verify.
      @return true if the address has more than the specific amount of the ERC20 token.
     */
    function hasBalanceInErc(address _contractAddress, address _anAddress, uint256 _amount)
      internal
      view
      returns (bool _hasBalance) {
        return ERC20(_contractAddress).balanceOf(_anAddress) >= _amount;
    }

    /**
      @notice It transfers a specific amount of tokens to an address.
      @dev It checks whether this contract has at least the amount.
      @return true if it transfers the tokens. Otherwise it returns false.
     */
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

    /**
      @notice It transfers a specific amount of ether to an address.
      @dev It checks if this smart contract has at least the amount of ether.
      @return true if it transfers the ether. Otherwise it returns false.
     */
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