pragma solidity 0.5.3;

/**
    @notice This represents the proxy to invoke smart contract functions.
    @dev It delegates the invocation calls to a specific smart contract.
    @author Guillermo Salazar.
 */
contract IERCProxy {
    uint256 constant public FORWARDING = 1;
    uint256 constant public UPGRADEABLE = 2;

    /**
        @notice It gets the proxy type (FORWARDING or UPGRADEABLE).
        @return The current proxy type.
     */
    function proxyType() external pure returns (uint256 proxyTypeId);

    /**
        @notice It returns the address implementation.
        @return The code address implementation.
     */
    function implementation() external view returns (address codeAddr);
}
