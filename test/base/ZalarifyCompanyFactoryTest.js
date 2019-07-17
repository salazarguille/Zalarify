const withData = require('leche').withData;

const ZalarifyCompanyFactoryMock = artifacts.require("./mock/base/ZalarifyCompanyFactoryMock.sol");
const ZalarifyCompanyFactory = artifacts.require("./base/ZalarifyCompanyFactory.sol");
const Storage = artifacts.require("./base/Storage.sol");
const IZalarify = artifacts.require("./interface/IZalarify.sol");
const Zalarify = artifacts.require("./Zalarify.sol");

const { createCompanyStruct, toBytes32 ,title: t} = require('../util/consts');

contract('ZalarifyCompanyFactoryTest', function (accounts) {
    const account1 = accounts[1];
    let instance;
    let zalarify;
    let instanceMock;

    beforeEach('Setup contract for each test', async () => {
        const proxyInstance = await Zalarify.deployed();
        zalarify = await IZalarify.at(proxyInstance.address);
        instance = await ZalarifyCompanyFactory.deployed();
        instanceMock = await ZalarifyCompanyFactoryMock.new(Storage.address);
    });

    withData({
        _1_basic: [],
    }, function() {
        it(t('anUser', 'new', 'Should be able to create a Zalarify company factory instance.', false), async function() {
            //Setup

            //Invocation
            const result = await ZalarifyCompanyFactory.new(Storage.address);

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_senderIsNotZalarify: [account1, 'MyCompanyId', "My Company LCC", "https://mycompany.com", "Description", 'Sender is not Zalarify.', true],
    }, function(address, id, name, website, description, expectedMessage, mustFail) {
        it(t('anUser', 'createZalarifyCompany', 'Should be able (or not) to create a Zalarify company contract.', mustFail), async function() {
            //Setup
            const companyStruct = createCompanyStruct(id, name, description, website, address);
            try {
                //Invocation
                const result = await instance.createZalarifyCompany(companyStruct, {
                    from: address
                });

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });

    withData({
        _1_basic: [account1, 'MyCompanyId', "My Company LCC", "https://mycompany.com", "Description", undefined, false]
    }, function(address, id, name, website, description, expectedMessage, mustFail) {
        it(t('anUser', 'createZalarifyCompany', 'Should be able (or not) to create a Zalarify company contract.', mustFail), async function() {
            //Setup
            try {
                //Invocation
                const result = await zalarify.createCompany(
                    toBytes32(id),
                    toBytes32(name),
                    toBytes32(description),
                    toBytes32(website), {
                    from: address
                });

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });

    withData({
        _1_withInvalidAccount: [accounts[0], 'Sender is not Zalarify.', true]
        //_2_withZalarify: [Zalarify.address, undefined, false]
    }, function(address, expectedMessage, mustFail) {
        it(t('anUser', 'isZalarify', 'Should be able (or not) to test modifier isZalarify.', mustFail), async function() {
            //Setup
            try {
                //Invocation
                const result = await instanceMock._isZalarify(address);

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert(error.message.endsWith(expectedMessage));
            }
        });
    });
});