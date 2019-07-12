/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import BadRequestError from '../lib/errors/BadRequestError';
import {
    getContract,
    getCompanyContract,
    getReceiptRegistryContract,
} from '../ethereum/zalarify/ZalarifyContract';
import {
    ZALARIFY,
} from '../util/constants';
import {
    getType,
} from '../util/employeeTypes';

import {
    getTokenDataByAddress,
} from './token.service';

export const getAddress = async (id, network) => {
    const zalarify = await getContract(ZALARIFY, network);
    const companyAddress = await zalarify.getCompany(id);
    return {
        companyAddress,
    };
};
const { utils } = new Web3();

export const getInfo = async (companyAddress, network) => {
    let company;
    let companyInfo;
    try {
        company = await getCompanyContract(companyAddress, network);
        companyInfo = await company.getInfo();
    } catch (error) {
        throw new BadRequestError(`Company ${companyAddress} not found.`);
    }
    const companyEmployees = await company.getEmployees();
    const isEnabled = await company.isCompanyEnabled();

    const mapEmployeeAsyncFunction = async (employee) => {
        const preferedTokenPayment = await getTokenDataByAddress(employee.preferedTokenPayment);
        return {
            name: utils.hexToString(employee.name),
            role: utils.hexToString(employee.role),
            email: utils.hexToString(employee.email),
            preferedTokenPayment,
            salaryAmount: parseInt(employee.salaryAmount.toString(), 10),
            employeeType: getType(employee.employeeType),
            enabled: employee.enabled,
            wallet: employee.employee,
        };
    };
    const employees = await Promise.all(companyEmployees.map(employee => mapEmployeeAsyncFunction(employee)));

    return {
        info: {
            isEnabled,
            id: utils.hexToString(companyInfo.id),
            name: utils.hexToString(companyInfo.name),
            description: utils.hexToString(companyInfo.description),
            website: utils.hexToString(companyInfo.website),
            creator: companyInfo.creator,
            createdAt: BigNumber(companyInfo.createdAt.toString()).times(1000),
        },
        employees,
    };
};

export const getCompanies = async (network) => {
    const mapCompanyAsyncFunction = async (company) => {
        const companyAddress = await getAddress(company.id, network);
        return {
            companyAddress: companyAddress.companyAddress,
            id: utils.hexToString(company.id),
            name: utils.hexToString(company.name),
            description: utils.hexToString(company.description),
            website: utils.hexToString(company.website),
            creator: company.creator,
            createdAt: BigNumber(company.createdAt.toString()).times(1000),
        };
    };

    const zalarify = await getContract(ZALARIFY, network);
    const companies = await zalarify.getCompanies();
    console.log(companies);

    const result = await Promise.all(companies.map(company => mapCompanyAsyncFunction(company)));
    return {
        count: result.length,
        items: result,
    };
};

export const getEmployee = async (companyAddress, employeeAddress, network) => {
    let employee;
    try {
        const receipt = await getReceiptRegistryContract(network);
        const company = await getCompanyContract(companyAddress, network);
        const employees = await company.getEmployees();
        console.log(employees);
        employee = employees.find(anEmployee => anEmployee.employee === employeeAddress);
        if (employee === undefined) {
            throw new Error(`Employee ${employeeAddress} not found.`);
        }
        const preferredTokenPayment = await getTokenDataByAddress(employee.preferedTokenPayment);
        const employeeReceipts = await receipt.getReceipts(companyAddress, employeeAddress);
        const receipts = employeeReceipts.map(aReceipt => ({
            ipfsUrl: `https://ipfs.io/ipfs/${aReceipt.ipfsHash}`,
            ipfsHash: aReceipt.ipfsHash,
            createdAt: BigNumber(aReceipt.createdAt.toString()).times(1000),
            path: aReceipt.path,
        }));
        return {
            receipts,
            preferredTokenPayment,
            wallet: employee.employee,
            name: utils.hexToString(employee.name),
            role: utils.hexToString(employee.role),
            email: utils.hexToString(employee.email),
            salaryAmount: parseInt(employee.salaryAmount.toString(), 10),
            employeeType: getType(employee.employeeType),
            enabled: employee.enabled,
        };
    } catch (error) {
        throw new BadRequestError(`Company ${companyAddress} or employee ${employeeAddress} not found.`);
    }
};
