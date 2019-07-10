pragma solidity 0.5.3;

contract IVault {

    /** Events */

    /**
        @dev This event is emitted when any tokens amount is withdrawn from the contract.
     */
    event TokensWithdrawn (
      address indexed thisContract,
      address erc20Contract,
      address who,
      address to,
      uint256 amount
    );

    /**
        @dev This event is emitted when ether amount withdrawn from the contract.
     */
    event EthersWithdrawn (
      address indexed thisContract,
      address who,
      address to,
      uint256 amount
    );


    /** Functions */

    function deposit() payable external returns (bool);

    function transferTokens(address _tokenAddress, address _toAddress, uint256 _amount) external returns (bool);

    function transferEthers(address payable _toAddress, uint256 _amount) external returns (bool);
}