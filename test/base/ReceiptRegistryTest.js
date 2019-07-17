const withData = require('leche').withData;

const ReceiptRegistry = artifacts.require("./base/ReceiptRegistry.sol");
const ZalarifyCompany = artifacts.require("./base/ZalarifyCompany.sol");
const Storage = artifacts.require("./base/Storage.sol");

const {
    toBytes32,
    title: t,
    NULL_ADDRESS,
    createCompanyStruct,
} = require('../util/consts');
const { receiptRegistry } = require('../util/events');

contract('ReceiptRegistryTest', function (accounts) {
    let instance;

    beforeEach('Setup contract for each test', async () => {
        const storage = await Storage.deployed();
        instance = await ReceiptRegistry.new(storage.address);
    });

    withData({
        _1_basic: [0, 1, 'MyPath1', 'MyHash1', undefined, false],
        _2_pathEmpty: [0, 1, '', 'MyHash1', 'String must not be empty.', true],
        _3_receiptHashEmpty: [0, 1, 'MyPath2', '', 'String must not be empty.', true],
        _4_employeeEmpty: [1, NULL_ADDRESS, 'MyPath4', 'MyHash4', 'Address must not be 0x0.', true]
    }, function(companyAddressIndex, employeeAddressIndex, receiptPath, receiptHash, expectedMessage, mustFail) {
        it(t('anUser', 'createReceipt', 'Should be able to create a receipt.', mustFail), async function() {
            //Setup
            const companyOwnerAddress = companyAddressIndex !== NULL_ADDRESS ? accounts[companyAddressIndex] : NULL_ADDRESS;
            const storage = await Storage.deployed();
            const companyStruct = createCompanyStruct(
                'companyId',
                'companyName',
                'companyDescription',
                'website',
                companyOwnerAddress,
            );
            const zalarifyCompany = await ZalarifyCompany.new(companyStruct, storage.address);
            const employeeAddress = employeeAddressIndex !== NULL_ADDRESS ? accounts[employeeAddressIndex] : NULL_ADDRESS;

            try {
                //Invocation
                const result = await instance.createReceipt(
                    zalarifyCompany.address,
                    employeeAddress,
                    receiptPath,
                    receiptHash,
                    {
                        from: companyOwnerAddress
                    }
                );

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                receiptRegistry
                    .newReceiptCreated(result)
                    .emitted(instance.address, zalarifyCompany.address, employeeAddress, receiptPath, receiptHash);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });

    withData({
        _1_receipts2: [0, 1, 2, true],
        _2_receipts0: [0, 1, 0, false]
    }, function(companyOwnerAddressIndex, employeeAddressIndex, countReceipts, hasReceiptsExpected) {
        it(t('anUser', 'hasReceipts', 'Should be able to test if company/employee has receipts.', false), async function() {
            //Setup
            const companyOwnerAddress = accounts[companyOwnerAddressIndex];
            const employeeAddress = accounts[employeeAddressIndex];
            const storage = await Storage.deployed();
            const companyStruct = createCompanyStruct(
                'companyId',
                'companyName',
                'companyDescription',
                'website',
                companyOwnerAddress,
            );
            const zalarifyCompany = await ZalarifyCompany.new(companyStruct, storage.address);
            for(let counter = 0; counter < countReceipts; counter++) {
                const pathBytes32 = toBytes32(`${counter}_${zalarifyCompany.address}${employeeAddress}`);
                const receiptHashBytes32 = toBytes32(`${counter}_${zalarifyCompany.address}${employeeAddress}`);
                await instance.createReceipt(zalarifyCompany.address, employeeAddress, pathBytes32, receiptHashBytes32);
            }

            //Invocation
            const result = await instance.hasReceipts(zalarifyCompany.address, employeeAddress);

            // Assertions
            assert.equal(result, hasReceiptsExpected);
        });
    });

    withData({
        _1_receipts2: [0, 1, 2, true],
        _2_receipts0: [0, 2, 0, false]
    }, function(companyOwnerAddressIndex, employeeAddressIndex, countReceipts, hasReceiptsExpected) {
        it(t('anUser', 'getReceipts', 'Should be able to get the company/employee receipts.', false), async function() {
            //Setup
            const companyOwnerAddress = accounts[companyOwnerAddressIndex];
            const employeeAddress = accounts[employeeAddressIndex];
            const storage = await Storage.deployed();
            const companyStruct = createCompanyStruct(
                'companyId',
                'companyName',
                'companyDescription',
                'website',
                companyOwnerAddress,
            );
            const zalarifyCompany = await ZalarifyCompany.new(companyStruct, storage.address);
            for(let counter = 0; counter < countReceipts; counter++) {
                const pathBytes32 = toBytes32(`${counter}_${zalarifyCompany.address}${employeeAddress}`);
                const receiptHashBytes32 = toBytes32(`${counter}_${zalarifyCompany.address}${employeeAddress}`);
                await instance.createReceipt(zalarifyCompany.address, employeeAddress, pathBytes32, receiptHashBytes32);
            }

            //Invocation
            const result = await instance.getReceipts(zalarifyCompany.address, employeeAddress);

            // Assertions
            assert.equal(result.length, countReceipts);
            result.forEach(receipt => {
                assert(receipt.createdAt);
                assert(receipt.ipfsHash);
            });
        });
    });
});