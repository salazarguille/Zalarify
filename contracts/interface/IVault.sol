pragma solidity 0.5.3;

/**
    @title This manages the Ether transferred to any smart contract. 
    @notice It is used as a Vault because any smart contract transfer the ether to this smart contract.
    @author Guillermo Salazar
 */
contract IVault {

    /** Events */

    /**
        @notice This event is emitted when any tokens amount is withdrawn from the contract.
        @param erc20Contract ERC20 where the tokens were withdrawn.
        @param who widthdraw the tokens.
        @param to who received the tokens.
        @param amount total amount transfered.
     */
    event TokensWithdrawn (
      address indexed thisContract,
      address erc20Contract,
      address who,
      address to,
      uint256 amount
    );

    /**
        @notice This event is emitted when ether amount withdrawn from the contract.
        @param thisContract This smart contract address.
        @param who widthdraw the tokens.
        @param to who received the tokens.
        @param amount total amount transfered.
     */
    event EthersWithdrawn (
      address indexed thisContract,
      address who,
      address to,
      uint256 amount
    );

    /** Functions */

    /**
      @notice It is used to deposit ether to the Vault by default.
      @dev This function is used by the Base smart contract in the fallback function to transfer any ether received.
      @return true if it received the ether transferred. Otherwise it returns false.
     */
    function deposit() payable external returns (bool);

    /**
      @notice It transfers a specific amount of tokens to an address.
      @dev It checks whether this contract has at least the amount.
      @return true if it transfers the tokens. Otherwise it returns false.
     */
    function transferTokens(address _tokenAddress, address _toAddress, uint256 _amount) external returns (bool);

    /**
      @notice It transfers a specific amount of ether to an address.
      @dev It checks if this smart contract has at least the amount of ether.
      @return true if it transfers the ether. Otherwise it returns false.
     */
    function transferEthers(address payable _toAddress, uint256 _amount) external returns (bool);
}