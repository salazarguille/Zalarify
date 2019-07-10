pragma solidity 0.5.3;

interface ISettings {

    /** Events */
    
    /**
        @dev This event is emitted when the platform is paused due to maintenance reasons.
     */
    event PlatformPaused (
        address indexed thisContract,
        string reason
    );

    /**
        @dev This event is emitted when the platform is unpaused.
     */
    event PlatformUnpaused (
        address indexed thisContract,
        string reason
    );

    /**
        @dev This event is emitted when the platform fee is updated.
     */
    event PlatformFeeUpdated (
        address indexed thisContract,
        uint16 oldPlatformFee,
        uint16 newPlatformFee
    );

    /** Functions */

    function setPlatformFee(uint16 _fee) external returns (bool);

    function getPlatformFee() external view returns (uint16);

    function pausePlatform(string calldata _reason) external returns (bool);

    function unpausePlatform(string calldata _reason) external returns (bool);

    function isPlatformPaused() external view returns (bool);
}
