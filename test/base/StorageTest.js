const Storage = artifacts.require("./base/Storage.sol");

const withData = require('leche').withData;
const { title: t, toBytes} = require('../util/consts');

contract('StorageTest', function (accounts) {

    const account0 = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];

    let instance;

    beforeEach('Setup contract for each test', async () => {
        instance = await Storage.new();
    });

    withData({
        _1_myKey_1: ["myKey", "1"],
        _2_myKey2_0: ["myKey2", "0"]
    }, function(key, value) {
        it(t('anUser', 'setUint', 'Should able to set an uint value.', false), async function() {
            // Setup
            const keySha3 = web3.utils.soliditySha3(key);

            // Invocation
            const result = await instance.setUint(keySha3, value);

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_myKey_true: ["myKey", true],
        _2_myKey2_false: ["myKey2", false]
    }, function(key, value) {
        it(t('anUser', 'setBool', 'Should able to set a bool value.', false), async function() {
            // Setup
            const keySha3 = web3.utils.soliditySha3(key);

            // Invocation
            const result = await instance.setBool(keySha3, value);

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_myKey_myValue: ["myKey", "myValue"],
        _2_myKey2_newValue: ["myKey2", "newValue"]
    }, function(key, value) {
        it(t('anUser', 'getBytes', 'Should able to get a bytes value.', false), async function() {
            // Setup
            const keySha3 = web3.utils.soliditySha3(key);
            const toBytesValue = toBytes(value);
            await instance.setBytes(keySha3, toBytesValue);

            // Invocation
            const result = await instance.getBytes(keySha3);

            // Assertions
            assert.equal(result.toString(), toBytesValue);
        });
    });

    withData({
        _1_myKey3_true: ["myKey3", true],
        _2_myKey4_false: ["myKey4", false]
    }, function(key, value) {
        it(t('anUser', 'getBytes', 'Should able to get a bool value.', false), async function() {
            // Setup
            const keySha3 = web3.utils.soliditySha3(key);
            await instance.setBool(keySha3, value);

            // Invocation
            const result = await instance.getBool(keySha3);

            // Assertions
            assert.equal(result, value);
        });
    });

    withData({
        _1_myKey3_true: [account1, "myKey3", true],
        _2_myKey4_false: [account2, "myKey4", false]
    }, function(from, key, value) {
        it(t('anUser', 'setBool', 'Should not able to set a bool value because user is not the owner.', true), async function() {
            // Setup
            const keySha3 = web3.utils.soliditySha3(key);

            try {
                // Invocation
                await instance.setBool(keySha3, value, { from });

                // Assertions
                assert(false, "It should have failed.");
            } catch (error) {
                // Assertions
                assert(error);
                assert.equal(error.reason, "Sender is not an owner.");
            }
        });
    });
});