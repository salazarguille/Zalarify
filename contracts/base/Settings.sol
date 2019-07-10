pragma solidity 0.5.3;

import "./Base.sol";
import "../interface/ISettings.sol";

contract Settings is Base, ISettings {

    /** Constructor */

    constructor(address _storageAddress)
    public
    Base(_storageAddress) {
        version = 1;
    }

    /** Modifiers */

    /** Functions */

    function getPlatformFee()
    external
    view
    returns (uint16){
        return _storage.getUint16(keccak256(abi.encodePacked(PLATFORM_FEE)));
    }

    function setPlatformFee(uint16 _fee)
    external
    onlySuperUser
    returns (bool) {
        uint16 oldPlatformFee = _storage.getUint16(keccak256(abi.encodePacked(PLATFORM_FEE)));
        _storage.setUint16(keccak256(abi.encodePacked(PLATFORM_FEE)), _fee);
        emit PlatformFeeUpdated(
            address(this),
            oldPlatformFee,
            _fee
        );
        return true;
    }

    function pausePlatform(string calldata reason)
    external
    onlySuperUser
    returns (bool) {
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
        _storage.setBool(keccak256(abi.encodePacked(STATE_PAUSED)), false);

        emit PlatformUnpaused(
            address(this),
            _reason
        );
    }

    function isPlatformPaused() external view returns (bool) {
        return _storage.getBool(keccak256(abi.encodePacked(STATE_PAUSED)));
    }

}
