const ProxyBaseMock = artifacts.require("./mock/proxy/ProxyBaseMock.sol");
const ProxyTargetMock = artifacts.require("./mock/proxy/ProxyTargetMock.sol");
const IProxyTargetMock = artifacts.require("./mock/proxy/IProxyTargetMock.sol");
const Storage = artifacts.require("./base/Storage.sol");

const { NULL_ADDRESS } = require('../../util/consts');
const withData = require('leche').withData;
const t = require('../../util/consts').title;

contract('ProxyBaseTest', function (accounts) {

    let storage;
    let proxyTargetMock;

    beforeEach('Setup contract for each test', async () => {
        storage = await Storage.new();
        assert(storage);
        assert(storage.address);

        proxyTargetMock = await ProxyTargetMock.deployed();
        assert(proxyTargetMock);
        assert(proxyTargetMock.address);
    });

    withData({
        _1_defined: ['myTargetId'],
        _2_empty: ['']
    }, function(targetId) {
        it(t('anUser', 'new', 'Should be able to create an instance.', false), async function() {
            //Setup
            const storageAddress = storage.address;
            
            //Invocation
            const result = await ProxyBaseMock.new(storageAddress, targetId);

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_targetId: ['TargetId'],
        _2_empty: [''],
    }, function(targetId) {
        it(t('anUser', 'getTargetId', 'Should be able to get the target id.', false), async function() {
            //Setup
            const instance = await ProxyBaseMock.new(storage.address, targetId);

            //Invocation
            const result = await instance.getTargetId();

            // Assertions
            assert.equal(result, targetId);
        });
    });

    withData({
        _1_proxy_234: [234, undefined, false],
        _1_proxy_0: [0, 'New value must > 0.', true]
    }, function(value, reasonExpected, mustFail) {
        it(t('anUser', 'fallback', 'Should be able (or not) to invoke function using proxy (delagatecall).', mustFail), async function() {
            //Setup
            const instance = await IProxyTargetMock.at(proxyTargetMock.address);
            const previousResult = await instance.value();

            try {
                //Invocation
                await instance.setValue(value);

                // Assertions
                assert.ok(!mustFail, "It should not have failed.");
                const result = await instance.value();
                assert.equal(result.toString(), value.toString());
            } catch(error) {
                // Assertions
                assert(mustFail, "It should have failed.");
                assert(error);
                assert.equal(error.reason, reasonExpected);
                
                const result = await instance.value();
                assert.equal(result.toString(), previousResult.toString());
            }
        });
    });

    withData({
        _1_ProxyTargetMock: ['ProxyTargetMock', undefined],
        _2_ProxyTargetMock: ['InvalidTargetId', NULL_ADDRESS]
    }, function(targetId, expectedAddress) {
        it(t('anUser', 'getTargetAddress', 'Should be able to get contract address based on target id / name.', false), async function() {
            //Setup
            const expectedTargetAddress = expectedAddress === undefined ? proxyTargetMock.address : expectedAddress;

            const instance = await ProxyBaseMock.deployed();

            //Invocation
            const result = await instance._getTargetAddress(targetId);

            // Assertions
            assert.equal(result, expectedTargetAddress);
        });
    });
});