/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js';
import {
    addFile,
    getFile,
} from './ipfs.service';
import {
    RECEIPT_REGISTRY,
} from '../util/constants';
import {
    getContract,
} from '../ethereum/zalarify/ZalarifyContract';

export const getAll = async (companyAddress, employeeAddress, network) => {
    const receiptRegistry = await getContract(RECEIPT_REGISTRY, network);
    const getReceiptsResult = await receiptRegistry.getReceipts(companyAddress, employeeAddress);
    return getReceiptsResult.map(receipt => ({
        createdAt: BigNumber(receipt.createdAt).times(1000),
        path: receipt.path,
        ipfsHash: receipt.ipfsHash,
        ipfsUrl: `https://ipfs.io/ipfs/${receipt.ipfsHash}`,
    }));
};

export const createReceipt = async (input, network) => {
    console.log(input);
    const fileName = `${Date.now()}_${input.employee.wallet}_${input.companyAddress}.txt`;
    const content = {
        employee: {
            name: input.employee.name,
            wallet: input.employee.wallet,
            salary: input.employee.salaryAmount,
            preferredToken: {
                address: input.employee.preferedTokenPayment.address,
                symbol: input.employee.preferedTokenPayment.symbol,
            },
        },
        payment: {
            provider: input.tokenRate.provider,
            source: {
                address: input.sourceToken.address,
                symbol: input.sourceToken.symbol,
                amount: new BigNumber(input.tokenRate.maxRate).toFixed(2),
            },
        },
        network,
        companyAddress: input.companyAddress,
    };

    const ipfsFile = await addFile(fileName, content, network);
    return ipfsFile;
};

export const getReceipt = async (hashFile, network) => {
    const fileContent = await getFile(hashFile, network);
    return fileContent;
};
