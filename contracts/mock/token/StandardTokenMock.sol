pragma solidity 0.5.3;

import "./StandardToken.sol";

// mock class using StandardToken
contract StandardTokenMock is StandardToken {

  constructor(address initialAccount, uint256 initialBalance)
  public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }
}
