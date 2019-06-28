pragma solidity 0.5.9;

contract StablePayCommon {

    struct SwappingProvider {
        address providerAddress;
        address ownerAddress;
        uint256 createdAt;
        bool pausedByOwner;
        bool pausedByAdmin;
        bool exists;
    }

    struct ExpectedRate {
        bytes32 providerKey;
        uint256 minRate;
        uint256 maxRate;
        bool isSupported;
    }

    struct Order {
        uint256 sourceAmount;
        uint256 targetAmount;
        uint256 makerAssetAmount;       // Amount of makerAsset being offered by maker. Must be greater than 0.
        uint256 takerAssetAmount;       // Amount of takerAsset being bid on by maker. Must be greater than 0.
        uint256 makerFee;               // Amount of ZRX paid to feeRecipient by maker when order is filled. If set to 0, no transfer of ZRX from maker to feeRecipient will be attempted.
        uint256 takerFee;               // Amount of ZRX paid to feeRecipient by taker when order is filled. If set to 0, no transfer of ZRX from taker to feeRecipient will be attempted.
        uint256 expirationTimeSeconds;  // Timestamp in seconds at which order expires.
        uint256 salt;                   // Arbitrary number to facilitate uniqueness of the order's hash.
        uint256 minRate;
        uint256 maxRate;
        
        address sourceToken;            // Source ERC20 token address.
        address targetToken;            // Target ERC20 token address.
        address toAddress;
        address fromAddress;
        address makerAddress;           // Address that created the order.
        address takerAddress;           // Address that is allowed to fill the order. If set to 0, any address is allowed to fill the order.
        address feeRecipientAddress;    // Address that will recieve fees when order is filled.
        address senderAddress;          // Address that is allowed to call Exchange contract methods that affect this order. If set to 0, any address is allowed to call these methods.

        bytes   signature;
        bytes   data;
        bytes   makerAssetData;           // Encoded data that can be decoded by a specified proxy contract when transferring makerAsset. The last byte references the id of this proxy.
        bytes   takerAssetData;           // Encoded data that can be decoded by a specified proxy contract when transferring takerAsset. The last byte references the id of this proxy.
    }
}