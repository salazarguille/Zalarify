const IsContractMock = artifacts.require("./mock/proxy/IsContractMock.sol");
const IsContract = artifacts.require("./base/IsContract.sol");
const Storage = artifacts.require("./base/Storage.sol");
const Zalarify = artifacts.require("./base/Zalarify.sol");

const withData = require('leche').withData;
const t = require('../../util/consts').title;

contract('IsContractTest', function (accounts) {

    const account0 = accounts[0];
    const account1 = accounts[1];
    let storage;
    let zalarify;

    beforeEach('Setup contract for each test', async () => {
        zalarify = await Zalarify.deployed();
        assert(zalarify);
        assert(zalarify.address);

        storage = await Storage.deployed();
        assert(storage);
        assert(storage.address);
    });

    withData({
        _1_creation: []
    }, function() {
        it(t('anUser', 'new', 'Should be able to create an instance.', false), async function() {
            //Setup
            
            //Invocation
            const result = await IsContract.new();

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_account0: [account0, false],
        _2_account1: [account1, false]
    }, function(address, isContractExpected) {
        it(t('anUser', 'isContract', 'Should be able to test address is an owned external account.', false), async function() {
            //Setup
            const instance = await IsContractMock.new();

            //Invocation
            const result = await instance._isContract(address);

            // Assertions
            assert.equal(result, isContractExpected);
        });
    });

    withData({
        _1_zalarify_address: [true]
    }, function(isContractExpected) {
        it(t('anUser', 'isContract', 'Should be able to test address is a contract.', false), async function() {
            //Setup
            const address = zalarify.address;
            const instance = await IsContractMock.new();

            //Invocation
            const result = await instance._isContract(address);

            // Assertions
            assert.equal(result, isContractExpected);
        });
    });

    withData({
        _1_storage_address: [true]
    }, function(isContractExpected) {
        it(t('anUser', 'isContract', 'Should be able to test address is a contract.', false), async function() {
            //Setup
            const address = storage.address;
            const instance = await IsContractMock.new();

            //Invocation
            const result = await instance._isContract(address);

            // Assertions
            assert.equal(result, isContractExpected);
        });
    });
});