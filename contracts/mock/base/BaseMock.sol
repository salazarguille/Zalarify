pragma solidity 0.5.3;

import "../../base/Base.sol";

/**
    @title Mock contract to test Base functions and modifiers.
    @author Guillermo Salazar
 */
contract BaseMock is Base {

    /** Constructor */

    /**
        @notice It creates a new BaseMock instance associated to an Eternal Storage implementation.
        @param _storage the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor (
        address _storage
    )
    public
    Base(
        _storage
    ) {
    }

    /** Functions */

    /**
        @notice Mock function to test the modifier nonReentrant.
     */
    function _nonReentrant()
        public
        nonReentrant()
        {}

    /**
        @notice Mock function to test the modifier onlyOwner.
     */
    function _onlyOwner()
        public
        view
        onlyOwner()
        {}

    /**
        @notice Mock function to test the modifier onlyAdmin.
     */
    function _onlyAdmin()
        public
        view
        onlyAdmin()
        {}

    /**
        @notice Mock function to test the modifier onlySuperUser.
     */
    function _onlySuperUser()
        public
        view
        onlySuperUser()
        {}

    /**
        @notice Mock function to test the modifier onlyRole.
     */
    function _onlyRole(string memory role)
        public
        view
        onlyRole(role)
        {}

    /**
        @notice Mock function to test the modifier isNotPaused.
     */
    function _isNotPaused()
        public
        view
        isNotPaused()
        {}       
}