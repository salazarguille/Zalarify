pragma solidity 0.5.3;

/**
    @notice This is an abstraction for the settings in the platform.
    @author Guillermo Salazar.
 */
interface ISettings {

    /** Events */
    
    /**
        @notice This event is emitted when the platform is paused due to maintenance reasons.
     */
    event PlatformPaused (
        address indexed thisContract,
        string reason
    );

    /**
        @notice This event is emitted when the platform is unpaused.
     */
    event PlatformUnpaused (
        address indexed thisContract,
        string reason
    );

    /** Functions */

    /**
        @notice It pauses the platform in emergency cases.
        @dev The sender must be a super user (owner or admin) only.

        @param _reason the reason why the platform is being paused.
     */
    function pausePlatform(string calldata _reason) external returns (bool);

    /**
        @notice It unpauses the platform in when an emergency issue was fixed.
        @dev The sender must be a super user (owner or admin) only.

        @param _reason the reason why the platform is being unpaused.
     */
    function unpausePlatform(string calldata _reason) external returns (bool);

    /**
        @notice It gets whether the platform is paused or not.
        @return true if the platform is paused. Otherwise it returns false.
     */
    function isPlatformPaused() external view returns (bool);

}
