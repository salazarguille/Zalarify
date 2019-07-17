pragma solidity 0.5.3;

import "./Base.sol";
import "../interface/ISettings.sol";

contract Settings is Base, ISettings {

    /** Constructor */

    constructor(address _storageAddress)
    public
    Base(_storageAddress) {}

    /** Modifiers */

    /** Functions */

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

    function unpausePlatform(string calldata _reason)
    external
    onlySuperUser
    returns (bool) {
        require(_isPlatformPaused(), "Zalarify is not paused.");
        _storage.setBool(keccak256(abi.encodePacked(STATE_PAUSED)), false);

        emit PlatformUnpaused(
            address(this),
            _reason
        );
    }

    function _isPlatformPaused() internal view returns (bool) {
        return _storage.getBool(keccak256(abi.encodePacked(STATE_PAUSED)));
    }

    function isPlatformPaused() external view returns (bool) {
        return _isPlatformPaused();
    }

}
