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

    /** Functions */

    function pausePlatform(string calldata _reason) external returns (bool);

    function unpausePlatform(string calldata _reason) external returns (bool);

    function isPlatformPaused() external view returns (bool);

}
