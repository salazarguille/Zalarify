pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../base/ZalarifyBase.sol";

contract ZalarifyBaseMock is ZalarifyBase {

    /** Events */

    /** Modifiers */

    /** Constructor */

    constructor(address _storageAddress)
        public ZalarifyBase(_storageAddress) {
        version = 1;
    }

    /** Methods */

}