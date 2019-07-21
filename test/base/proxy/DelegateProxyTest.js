const DelegateProxyMock = artifacts.require("./mock/proxy/DelegateProxyMock.sol");
const ProxyTargetMock = artifacts.require("./mock/proxy/ProxyTargetMock.sol");
const IProxyTargetMock = artifacts.require("./mock/proxy/IProxyTargetMock.sol");
const Storage = artifacts.require("./base/Storage.sol");

const { NULL_ADDRESS } = require('../../util/consts');
const withData = require('leche').withData;
const t = require('../../util/consts').title;

contract('DelegateProxyTest', function (accounts) {

    const account0 = accounts[0];

    let proxyTargetMock;

    beforeEach('Setup contract for each test', async () => {
        proxyTargetMock = await ProxyTargetMock.deployed();
        assert(proxyTargetMock);
        assert(proxyTargetMock.address);
    });

    withData({
        _1_proxyTargetMockAddress: [undefined],
        _2_emptyAddress: [NULL_ADDRESS]
    }, function(address) {
        it(t('anUser', 'new', 'Should be able to create a inherited contract.', false), async function() {
            //Setup
            const proxyAddress = address === undefined ? proxyTargetMock.address : address;

            // Invocation
            const result = await DelegateProxyMock.new(proxyAddress);

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_proxy_234: [ProxyTargetMock, 234, 50000, undefined, false],
        _2_proxy_0: [ProxyTargetMock, 0, 'New value must > 0.', true]
    }, function(contract, value, reasonExpected, mustFail) {
        it(t('anUser', 'delegatedFwd', 'Should be able (or not) to invoke delagatecall function.', mustFail), async function() {
            //Setup
            const storage = await Storage.deployed();
            const contractInstance = await contract.new(storage.address);
            const delegateProxy = await DelegateProxyMock.new(contractInstance.address);
            const instance = await IProxyTargetMock.at(delegateProxy.address);

            try {
                //Invocation
                const result = await instance.setValue(value);

                // Assertions
                assert.ok(!mustFail, "It should not have failed.");
            } catch(error) {
                // Assertions
                assert(mustFail, "It should have failed.");
                assert(error);
                assert.equal(error.reason, reasonExpected);
            }
        });
    });

    withData({
        _1_account_453: [account0, 453, 'Destination address is not a contract.', true],
        _2_0x0_123: [NULL_ADDRESS, 123, 'Destination address is not a contract.', true],
    }, function(address, value, reasonExpected, mustFail) {
        it(t('anUser', 'delegatedFwd', 'Should be able (or not) to invoke delagatecall function.', mustFail), async function() {
            //Setup
            const delegateProxy = await DelegateProxyMock.new(address);
            const instance = await IProxyTargetMock.at(delegateProxy.address);

            try {
                //Invocation
                await instance.setValue(value);

                // Assertions
                assert.ok(!mustFail, "It should not have failed.");
            } catch(error) {
                // Assertions
                assert(mustFail, "It should have failed.");
                assert(error);
                assert.equal(error.reason, reasonExpected);
            }
        });
    });
});