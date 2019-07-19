pragma solidity 0.5.3;

import "./Base.sol";
import "../interface/ISettings.sol";

/**
    @title This manages the settings for the platform.
    @author Guillermo Salazar

    @notice It allows configure some aspect in the platform once it is deployed.
 */
contract Settings is Base, ISettings {

    /** Constructor */

    /**
        @notice It creates a new Role instance associated to an Eternal Storage implementation.
        @param _storageAddress the Eternal Storage implementation.
        @dev The Eternal Storage implementation must implement the IStorage interface.
     */
    constructor(address _storageAddress)
    public
    Base(_storageAddress) {}

    /** Modifiers */

    /** Functions */

    /**
        @notice It pauses the platform in emergency cases.
        @dev The sender must be a super user (owner or admin) only.

        @param reason the reason why the platform is being paused.
     */
    function pausePlatform(string calldata reason)
    external
    onlySuperUser
    returns (bool) {
        require(!_isPlatformPaused(), "Zalarify is already paused.");
        _storage.setBool(keccak256(abi.encodePacked(STATE_PAUSED)), true);

        emit PlatformPaused(
            address(this),
            reason
        );
    }

    /**
        @notice It unpauses the platform in when an emergency issue was fixed.
        @dev The sender must be a super user (owner or admin) only.

        @param reason the reason why the platform is being unpaused.
     */
    function unpausePlatform(string calldata reason)
    external
    onlySuperUser
    returns (bool) {
        require(_isPlatformPaused(), "Zalarify is not paused.");
        _storage.setBool(keccak256(abi.encodePacked(STATE_PAUSED)), false);

        emit PlatformUnpaused(
            address(this),
            reason
        );
    }

    /**
        @notice It gets whether the platform is paused or not.
        @return true if the platform is paused. Otherwise it returns false.
     */
    function _isPlatformPaused() internal view returns (bool) {
        return _storage.getBool(keccak256(abi.encodePacked(STATE_PAUSED)));
    }

    /**
        @notice It gets whether the platform is paused or not.
        @return true if the platform is paused. Otherwise it returns false.
     */
    function isPlatformPaused() external view returns (bool) {
        return _isPlatformPaused();
    }

}
