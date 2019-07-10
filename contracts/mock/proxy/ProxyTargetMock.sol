pragma solidity 0.5.3;

import "../../base/Base.sol";

contract ProxyTargetMock is Base {
    
    /** Constants */

    /** Variables */
    uint public value;

    /** Events */

    /** Modifiers */

    /** Constructor */
    constructor(address _storage)
      Base(_storage)
      public {
    }

    function setValue(uint _newValue) public {
      require(_newValue > 0, "New value must > 0.");
      value = _newValue;
    }
}