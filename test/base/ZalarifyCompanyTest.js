const withData = require('leche').withData;

const ZalarifyCompanyMock = artifacts.require("./mock/base/ZalarifyCompanyMock.sol");

const Storage = artifacts.require("./base/Storage.sol");
const IZalarify = artifacts.require("./interface/IZalarify.sol");
const IZalarifyCompany = artifacts.require("./interface/IZalarifyCompany.sol");
const Zalarify = artifacts.require("./Zalarify.sol");

const { createCompanyStruct, NULL_ADDRESS, toBytes32 ,title: t} = require('../util/consts');

const { company } = require('../util/events');

contract('ZalarifyCompanyTest', function (accounts) {
    const account1 = accounts[1];
    const account2 = accounts[2];
    const account3 = accounts[3];
    let zalarify;

    beforeEach('Setup contract for each test', async () => {
        const proxyInstance = await Zalarify.deployed();
        zalarify = await IZalarify.at(proxyInstance.address);
    });

    withData({
        _1_validCompanyOwner: [account1, account1, undefined, false],
        _2_invalidCompanyOwner: [account3, account2, 'Sender is not a company owner.', true],
    }, function(companyOwner, companyOwnerToTest, expectedMessage, mustFail) {
        it(t('anUser', 'isCompanyOwner', 'Should be able (or not) to test is an address is the company owner.', mustFail), async function() {
            //Setup
            const companyStruct = createCompanyStruct('Id', 'Name', 'Description', 'Website', companyOwner);
            const companyAddress = await ZalarifyCompanyMock.new(companyStruct, Storage.address);

            try {
                //Invocation
                const result = await companyAddress._isCompanyOwner(companyOwnerToTest);

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

    withData({
        _1_validEmployee: [account2, account2, undefined, false],
        _2_invalidEmployee: [account2, account3, 'Address is not an employee.', true],
    }, function(employeeAddress, employeeToTest, expectedMessage, mustFail) {
        it(t('anUser', 'isEmployee', 'Should be able (or not) to test is an address is an employee.', mustFail), async function() {
            //Setup
            const companyOwner = accounts[1];
            const companyStruct = createCompanyStruct('Id', 'Name', 'Description', 'Website', companyOwner);
            const companyAddress = await ZalarifyCompanyMock.new(companyStruct, Storage.address);
            await companyAddress.addEmployee(
                employeeAddress,
                0,
                toBytes32('EmployeeName'),
                toBytes32('EmployeeRole'),
                toBytes32('EmployeeEmail'),
                NULL_ADDRESS,
                10, {
                    from: companyOwner
                }
            );

            try {
                //Invocation
                const result = await companyAddress._isEmployee(employeeToTest);

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

    withData({
        _1_alreadyEmployee: [account2, account2, 'Address is already an employee.', true],
        _2_notEmployee: [account2, account3, undefined, false],
    }, function(employeeAddress, employeeToTest, expectedMessage, mustFail) {
        it(t('anUser', 'isNotEmployee', 'Should be able (or not) to test is an address is an employee.', mustFail), async function() {
            //Setup
            const companyOwner = accounts[1];
            const companyStruct = createCompanyStruct('Id', 'Name', 'Description', 'Website', companyOwner);
            const companyAddress = await ZalarifyCompanyMock.new(companyStruct, Storage.address);
            await companyAddress.addEmployee(
                employeeAddress,
                0,
                toBytes32('EmployeeName'),
                toBytes32('EmployeeRole'),
                toBytes32('EmployeeEmail'),
                NULL_ADDRESS,
                10, {
                    from: companyOwner
                }
            );

            try {
                //Invocation
                const result = await companyAddress._isNotEmployee(employeeToTest);

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

    withData({
        _1_owner: [account1, account1, "Pause company 1", true, undefined, false],
        _2_notOwner: [account1, account2, "Pause company 2", false, 'Sender is not a company owner.', true],
    }, function(companyOwner, addressToPause, reason, isCompanyPausedExpected, expectedMessage, mustFail) {
        it(t('anUser', 'pause', 'Should be able to pause a company.', mustFail), async function() {
            //Setup
            const zalarifyProxy = await Zalarify.deployed();
            const zalarify = await IZalarify.at(zalarifyProxy.address);
            const createCompanyResult = await zalarify.createCompany(
                toBytes32('Id' + reason),
                toBytes32('Name'),
                toBytes32('Website'),
                toBytes32('Description'), {
                    from: companyOwner
                }
            );
            const newCompanyCreatedEvent = createCompanyResult.logs[0].args;
            const companyInstance = await IZalarifyCompany.at(newCompanyCreatedEvent.companyAddress);

            try {
                //Invocation
                const result = await companyInstance.pause(toBytes32(reason), {from: addressToPause});

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
                company
                    .pausedCompany(result)
                    .emitted(newCompanyCreatedEvent.companyAddress, companyOwner, reason);
                
                assert.equal(true, isCompanyPausedExpected);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });

    withData({
        _1_owner: ['id1', account1, account1, true, undefined, false],
        _2_notOwner: ['id2', account1, account2, false, 'Sender is not a company owner.', true],
    }, function(id, companyOwner, addressToPause, isCompanyPausedExpected, expectedMessage, mustFail) {
        it(t('anUser', 'unpause', 'Should be able to unpause a company.', mustFail), async function() {
            //Setup
            const zalarifyProxy = await Zalarify.deployed();
            const zalarify = await IZalarify.at(zalarifyProxy.address);
            const createCompanyResult = await zalarify.createCompany(
                toBytes32(id),
                toBytes32('Name'),
                toBytes32('Website'),
                toBytes32('Description'), {
                    from: companyOwner
                }
            );
            const newCompanyCreatedEvent = createCompanyResult.logs[0].args;
            const companyInstance = await IZalarifyCompany.at(newCompanyCreatedEvent.companyAddress);
            await companyInstance.pause(toBytes32('My Reason'), {from: companyOwner});

            try {
                //Invocation
                const result = await companyInstance.unpause({from: addressToPause});

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
                company
                    .unpausedCompany(result)
                    .emitted(newCompanyCreatedEvent.companyAddress, companyOwner);
                
                assert.equal(true, isCompanyPausedExpected);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });
});