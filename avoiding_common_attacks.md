![diagram](./docs/images/horizontal_logo_name.png)

# Avoiding Common Attacks
---

As one of the topic I prioritized on the platform design, this document explains how Zalarify avoids common attacks.

## Re-entracy

The platform smart contracts don't interact with unknown external smart contracts. The most important external provider is StablePay, and it is a well known decentralized platform.

However, the Zalarify smart contracts used the techniques to mitigrate this kind of attacks.

## Transaction Ordering and Timestamp Dependence

In this case, it doesn't apply due to Zalarify doesn't depend on the transaction ordering. In the other hand, regarding the timestamp dependence, Zalarify just uses the timestamp to inform to the company owners and employees when a payment was sent, or when a new employee was added.

## Overflow and Underflow

Integers can underflow or overflow in the EVM.

So, to avoid this issue, Zalarify uses a well known Solidity library called: ```SafeMath.sol```.

It is a OpenZeppelin smart contract. It can be found in [this link](https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol).

## Denial of Service

The smart contracts doesn't manage Ether, just ERC20 tokens. However, the Base smart contract (where all the smart contract inherit from) implements a fallback function to transfer Ether to the Vault smart contract. Then, the Vault implementation has specific functions to withdraw a specific amount of ether or tokens to specific address. It must just executed by an owner.

## Denial of Service by Block Gas Limit (or startGas)

This attack may be used when the smart contract uses a while/for loop. The only smart contracts that implement those statements are view functions. Even, when the platform calls the transferWithTokens (the StablePay function), an array just with one item (a provider key) is passed.

## Force Sending Ether

Any smart contract in the plaform uses Ether, except the Vault implementation. As I mentioned before, it has some functions to withdraw/transfer Ether or ERC20 tokens if it is needed.

## Static Analysis With Slither

As I mentioned in the [README.md](./README.md) file, the platform was analyzed with the tool Slither. See the results in Security section.
