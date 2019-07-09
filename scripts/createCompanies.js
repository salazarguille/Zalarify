/**
    Purpose:
    It verifies the swapping provider information.

    How do I execute this script?

    truffle exec ./scripts/verifySwappingProviderStatus.js --network infuraRopsten
 */

// Smart contracts
const IZalarify = artifacts.require("./interface/IZalarify.sol");
const IZalarifyCompany = artifacts.require("./interface/IZalarifyCompany.sol");

// Util classes
const assert = require('assert');
const ProcessArgs = require('../src/utils/ProcessArgs');
const { toBytes32 } = require('../test/util/consts');
const processArgs = new ProcessArgs();

/**
    Script Arguments
 */
module.exports = async (callback) => {
    try {
        const network = processArgs.network();
        console.log(`Script will be executed in network ${network}.`)
        const companiesData = require('./companies');
        const companies = companiesData[network];

        const appConf = require('../config')(network);
        const maxGas = appConf.maxGas;
        const tokens = appConf.tokens.tokens;
        const zalarifyConf = appConf.zalarify;

        const zalarify = await IZalarify.at(zalarifyConf.contracts.Zalarify);
        
        assert(zalarify.address, "Zalarify address is undefined.");

        const accounts = await web3.eth.getAccounts();
        assert(accounts, "Accounts must be defined.");

        for (const company of companies) {
            const idPostfixRandom = Date.now().toString().substr(5);
            const companyOwner = accounts[company.ownerIndex];
            const createCompanyResult = await zalarify.createCompany(
                toBytes32(`${company.id}_${idPostfixRandom}`),
                toBytes32(company.name),
                toBytes32(company.website),
                toBytes32(company.description),
                { from: companyOwner, gas: maxGas});
            const companyAddress = createCompanyResult.logs[0].args.companyAddress;
            console.log(`New Company '${company.name}' at: '${companyAddress}'`);
            const zalarifyCompany = await IZalarifyCompany.at(companyAddress);

            for (const employee of company.employees) {
                const employeeAddress = accounts[employee.addressIndex];
                const paymentTokenAddress = tokens[employee.paymentTokenName];
                assert(paymentTokenAddress, 'Token payment address is undefined.');
                const addEmployeeResult = await zalarifyCompany.addEmployee(
                    employeeAddress,
                    employee.type,
                    toBytes32(employee.name),
                    toBytes32(employee.role),
                    toBytes32(employee.email),
                    paymentTokenAddress,
                    employee.salary,
                    { from: companyOwner, maxGas: maxGas }
                );
                assert(addEmployeeResult, 'Add employee result is undefined.');
                const newEmployeeAddedEvent = addEmployeeResult.logs[0];
                assert(newEmployeeAddedEvent, 'New employee event is undefined.');
                assert(newEmployeeAddedEvent.args, 'New employee event args is undefined.');
                assert(newEmployeeAddedEvent.args.newEmployee, 'New employee address is undefined.');
                console.log(`New Employee '${employee.name}': '${newEmployeeAddedEvent.args.newEmployee}' for Company: '${companyAddress}'`);
            }
            console.log('-'.repeat(100));
        };

        console.log('>>>> The script finished successfully. <<<<');
        callback();
    } catch (error) {
        console.log(error);
        callback(error);
    }
};
