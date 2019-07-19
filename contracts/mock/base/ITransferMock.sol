pragma solidity 0.5.3;

/**
    @title Mock interface to test fallback functions.
    @author Guillermo Salazar
 */
contract ITransferMock {
    
    /** Events */

    /** Functions */

    /**
        @notice It is a mock function to test a fallback function.
        @return true if the function was success. Otherwise it returns false.
     */
    function transferEther() public payable returns (bool);
}