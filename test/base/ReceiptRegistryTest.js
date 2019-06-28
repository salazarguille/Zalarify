const withData = require('leche').withData;

const ReceiptRegistry = artifacts.require("./base/ReceiptRegistry.sol");
const Storage = artifacts.require("./base/Storage.sol");

const {
    toBytes32,
    title: t,
    NULL_ADDRESS
} = require('../util/consts');
const { receiptRegistry } = require('../util/events');

contract('ReceiptRegistryTest', function (accounts) {
    let instance;

    beforeEach('Setup contract for each test', async () => {
        const storage = await Storage.deployed();
        instance = await ReceiptRegistry.new(storage.address);
    });

    withData({
        _1_basic: [0, 1, 'MyHash1', undefined, false],
        _2_receiptHashEmpty: [0, 1, '', 'Bytes32 must not be 0x0.', true],
        _3_companyEmpty: [NULL_ADDRESS, 1, 'MyHash3', 'Address must not be 0x0.', true],
        _4_employeeEmpty: [1, NULL_ADDRESS, 'MyHash4', 'Address must not be 0x0.', true]
    }, function(companyAddressIndex, employeeAddressIndex, receiptHash, expectedMessage, mustFail) {
        it(t('anUser', 'createReceipt', 'Should be able to create a receipt.', mustFail), async function() {
            //Setup
            const companyAddress = companyAddressIndex !== NULL_ADDRESS ? accounts[companyAddressIndex] : NULL_ADDRESS;
            const employeeAddress = employeeAddressIndex !== NULL_ADDRESS ? accounts[employeeAddressIndex] : NULL_ADDRESS;
            const receiptHashBytes32 = toBytes32(receiptHash);

            try {
                //Invocation
                const result = await instance.createReceipt(companyAddress, employeeAddress, receiptHashBytes32);

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                receiptRegistry
                    .newReceiptCreated(result)
                    .emitted(instance.address, companyAddress, employeeAddress, receiptHashBytes32);
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
    }, function(companyAddressIndex, employeeAddressIndex, countReceipts, hasReceiptsExpected) {
        it(t('anUser', 'hasReceipts', 'Should be able to test if company/employee has receipts.', false), async function() {
            //Setup
            const companyAddress = accounts[companyAddressIndex];
            const employeeAddress = accounts[employeeAddressIndex];
            for(let counter = 0; counter < countReceipts; counter++) {
                const receiptHashBytes32 = toBytes32(`${counter}_${companyAddress}${employeeAddress}`);
                await instance.createReceipt(companyAddress, employeeAddress, receiptHashBytes32);
            }

            //Invocation
            const result = await instance.hasReceipts(companyAddress, employeeAddress);

            // Assertions
            assert.equal(result, hasReceiptsExpected);
        });
    });

    withData({
        _1_receipts2: [0, 1, 2, true],
        _2_receipts0: [0, 2, 0, false]
    }, function(companyAddressIndex, employeeAddressIndex, countReceipts, hasReceiptsExpected) {
        it(t('anUser', 'getReceipts', 'Should be able to get the company/employee receipts.', false), async function() {
            //Setup
            const companyAddress = accounts[companyAddressIndex];
            const employeeAddress = accounts[employeeAddressIndex];
            for(let counter = 0; counter < countReceipts; counter++) {
                const receiptHashBytes32 = toBytes32(`${counter}_${companyAddress}${employeeAddress}`);
                await instance.createReceipt(companyAddress, employeeAddress, receiptHashBytes32);
            }

            //Invocation
            const result = await instance.getReceipts(companyAddress, employeeAddress);

            // Assertions
            assert.equal(result.length, countReceipts);
            result.forEach(receipt => {
                assert(receipt.createdAt);
                assert(receipt.hash);
            });
        });
    });
});