pragma solidity 0.5.9;
pragma experimental ABIEncoderV2;

import "../../base/ZalarifyBase.sol";

contract ZalarifyBaseMock is ZalarifyBase {

    /** Events */

    /** Modifiers */

    /** Constructor */

    constructor(address _storageAddress)
        public ZalarifyBase(_storageAddress) {
        version = 1;
    }

    /** Functions */

    function _createCompanyStruct(bytes32 _id, bytes32 _name, bytes32 _website, bytes32 _description, address _creator)
        public
        view
        returns (ZalarifyCommon.Company memory company){
            return createCompanyStruct(
                _id,
                _name,
                _website,
                _description,
                _creator
            );
    }
}