
const Vault = artifacts.require("./base/Vault.sol");
const ITransferMock = artifacts.require("./interface/ITransferMock.sol");

const withData = require('leche').withData;
const BigNumber = require('bignumber.js');
const t = require('../util/consts').title;
const base = require('../util/events').base;

contract('VaultTest', function (accounts) {

    const account0 = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];

    let instance;

    beforeEach('Setup contract for each test', async () => {
        instance = await Vault.deployed();
    });

    it(t('owner', 'new', 'Should deploy Vault contract.'), async function () {
        assert(instance);
        assert(instance.address);
    });

    withData({
        _1_1ether: ["1"],
        _1_000001ether: ["0.00001"]
    }, function(valueEther) {
        it(t('anOwner', 'deposit', 'Should able to deposit ether.', false), async function() {
            // Setup
            const valueWei = web3.utils.toWei(valueEther, 'ether');
            const beforeBalance = await web3.eth.getBalance(instance.address);
            
            // Invocation
            const result = await instance.deposit({from: account0, value: valueWei});

            // Assertions
            const afterBalance = await web3.eth.getBalance(instance.address);
            await base
                .depositReceived(result)
                .emitted(instance.address, account0, valueWei);

            const diffBalance = BigNumber(afterBalance.toString()).minus(BigNumber(beforeBalance.toString()));
            assert.equal(diffBalance, valueWei);
        });
    });

    withData({
        _1_1ether: ["0", "Msg value > 0."]
    }, function(valueWei, messageExpected) {
        it(t('anOwner', 'deposit', 'Should not able to deposit ether.', true), async function() {
            // Setup

            // Invocation
            try {
                await instance.deposit({from: account0, value: valueWei});

                // Assertions
                fail(false, "It should have failed because the value is invalid.");
            } catch (error) {
                // Assertions
                assert(error);
                assert.equal(error.reason, messageExpected);
            }
        });
    });

    withData({
        _1_1ether: [accounts[0], "1", "Msg value > 0."]
    }, function(address, amount, messageExpected, mustFail) {
        it(t('anOwner', 'fallback', 'Should be able to transfer ether using fallback ether.', false), async function() {
            // Setup
            const amountWei = await web3.utils.toWei(amount, 'ether');
            const vaultInitialBalance = await web3.eth.getBalance(instance.address);
            const transferMock = await ITransferMock.at(instance.address);

            // Invocation
            try {
                const result = await transferMock.transferEther({from: address, value: amountWei});

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
                const vaultFinalBalance = await web3.eth.getBalance(instance.address);
                assert.equal(amountWei, BigNumber(vaultFinalBalance.toString()).minus(BigNumber(vaultInitialBalance.toString())));
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, messageExpected);
            }
        });
    });
});