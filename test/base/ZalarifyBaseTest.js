const withData = require('leche').withData;
const _ = require('lodash');

const Zalarify = artifacts.require("./Zalarify.sol");
const IZalarify = artifacts.require("./interface/IZalarify.sol");
const ZalarifyCompany = artifacts.require("./base/ZalarifyCompany.sol");
const ZalarifyBaseMock = artifacts.require("./mock/base/ZalarifyBaseMock.sol");
const Storage = artifacts.require("./base/Storage.sol");

const { toBytes32, title: t, NULL_ADDRESS} = require('../util/consts');
const { zalarify } = require('../util/events');

contract('ZalarifyBaseTest', function (accounts) {
    const account1 = accounts[1];
    let instance;

    beforeEach('Setup contract for each test', async () => {
        const zalarifyProxy = await Zalarify.deployed();
        instance = await IZalarify.at(zalarifyProxy.address);
    });

    withData({
        _1_basic: [account1, 'MyCompanyId', "My Company LCC", "https://mycompany.com", "Description", undefined, false],
        _2_idEmpty: [account1, '', "My Company LCC", "Description", '', 'Bytes must not be empty.', true],
        _3_nameEmpty: [account1, 'MyOtherCompany', "", "Description", "https://myothercompany.com", 'Bytes must not be empty.', true],
        _4_descriptionEmpty: [account1, 'MyCompanyId2', "My Company 2 LCC", "https://mycompany2.com", '', undefined, false],
        _5_websiteEmpty: [account1, 'MyCompanyId2', "My Company 2 LCC", '', 'Description', 'Bytes must not be empty.', true],
    }, function(address, id, name, website, description, expectedMessage, mustFail) {
        it(t('anUser', 'createCompany', 'Should be able to create a company.', mustFail), async function() {
            //Setup
            try {
                //Invocation
                const result = await instance.createCompany(
                    toBytes32(id),
                    toBytes32(name),
                    toBytes32(website),
                    toBytes32(description), {
                        from: address
                    });

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                zalarify
                    .newCompanyCreated(result)
                    .emitted(instance.address, address);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });

    withData({
        _1_basic: [account1, 'MyCompanyId', "My Company LCC", "https://mycompany.com", "Description", undefined, false],
        _2_idEmpty: [account1, '', "My Company LCC", "Description", '', 'Bytes must not be empty.', true],
        _3_nameEmpty: [account1, 'MyOtherCompany', "", "Description", "https://myothercompany.com", 'Bytes must not be empty.', true],
        _4_descriptionEmpty: [account1, 'MyCompanyId2', "My Company 2 LCC", "https://mycompany2.com", '', undefined, false],
        _5_websiteEmpty: [account1, 'MyCompanyId2', "My Company 2 LCC", '', 'Description', 'Bytes must not be empty.', true],
    }, function(address, id, name, website, description, expectedMessage, mustFail) {
        it(t('anUser', 'createCompanyStruct', 'Should be able to create a company.', mustFail), async function() {
            //Setup
            const storage = await Storage.deployed();
            const instance = await ZalarifyBaseMock.new(storage.address);
            const idBytes32 = toBytes32(id);
            const nameBytes32 = toBytes32(name);
            const websiteBytes32 = toBytes32(website);
            const descriptionBytes32 = toBytes32(description);

            //Invocation
            const result = await instance._createCompanyStruct(
                idBytes32,
                nameBytes32,
                websiteBytes32,
                descriptionBytes32,
                address
            );

            // Assertions
            assert.equal(result.id, idBytes32);
            assert.equal(result.name, nameBytes32);
            assert.equal(result.website, websiteBytes32);
            assert.equal(result.description, descriptionBytes32);
            assert.equal(result.creator, address);
        });
    });

    withData({
        _1_basic: [account1, 'MyCompanyId', "My Company LCC", "https://mycompany.com", "Description"]
    }, function(address, id, name, website, description) {
        it(t('anUser', 'registerCompany', 'Should be able to register a company.', false), async function() {
            //Setup
            const storage = await Storage.deployed();
            const instance = await ZalarifyBaseMock.new(storage.address);
            const idBytes32 = toBytes32(id);
            const nameBytes32 = toBytes32(name);
            const websiteBytes32 = toBytes32(website);
            const descriptionBytes32 = toBytes32(description);
            const companyStruct = [
                idBytes32,
                nameBytes32,
                descriptionBytes32,
                websiteBytes32,
                address,
                Date.now()
            ];
            const company = await ZalarifyCompany.new(companyStruct, storage.address);

            //Invocation
            const result = await instance._registerCompany(idBytes32, company.address);

            // Assertions
            assert(result);
            const companiesResult = await instance.companies(idBytes32);
            assert(companiesResult);
        });
    });
});