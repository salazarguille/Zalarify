/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import getProvider from '../ethers';
import { getContractAddress } from '../../lib/util';
import AppError from '../../lib/errors/AppError';
import IZalarify from '../abi/IZalarify.json';
import IReceiptRegistry from '../abi/IReceiptRegistry.json';
import IZalarifyCompany from '../abi/IZalarifyCompany.json';
import {
    HOMESTEAD,
    ROPSTEN,
    ZALARIFY,
    GANACHE,
    RECEIPT_REGISTRY,
} from '../../util/constants';

function initContracts(network) {
    let zalarifyRopstenContract;
    let receiptRegistryRopstenContract;

    let zalarifyGanacheContract;
    let receiptRegistryGanacheContract;
    if (network.toUpperCase() === GANACHE) {
        zalarifyGanacheContract = new ethers.Contract(getContractAddress(ZALARIFY, GANACHE), IZalarify.abi, getProvider(GANACHE));
        receiptRegistryGanacheContract = new ethers.Contract(getContractAddress(RECEIPT_REGISTRY, GANACHE), IReceiptRegistry.abi, getProvider(GANACHE));
    }
    if (network.toUpperCase() === ROPSTEN) {
        zalarifyRopstenContract = new ethers.Contract(getContractAddress(ZALARIFY, ROPSTEN), IZalarify.abi, getProvider(ROPSTEN));
        receiptRegistryRopstenContract = new ethers.Contract(getContractAddress(RECEIPT_REGISTRY, ROPSTEN), IReceiptRegistry.abi, getProvider(ROPSTEN));
    }
    return {
        zalarifyRopstenContract,
        receiptRegistryRopstenContract,

        zalarifyGanacheContract,
        receiptRegistryGanacheContract,
    };
}

export const getContract = async (service, network) => {
    const {
        zalarifyRopstenContract,
        receiptRegistryRopstenContract,

        zalarifyGanacheContract,
        receiptRegistryGanacheContract,
    } = initContracts(network);

    switch (service.toUpperCase()) {
        case ZALARIFY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    throw new AppError('Zalarify is not deployed on Mainnet.');
                case ROPSTEN:
                    return zalarifyRopstenContract;
                case GANACHE:
                    return zalarifyGanacheContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case RECEIPT_REGISTRY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    throw new AppError('Zalarify is not deployed on Mainnet.');
                case ROPSTEN:
                    return receiptRegistryRopstenContract;
                case GANACHE:
                    return receiptRegistryGanacheContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'CONTRACT_NOT_SUPPORTED';
    }
};

// eslint-disable-next-line max-len
export const getCompanyContract = async (address, network) => new ethers.Contract(address, IZalarifyCompany.abi, getProvider(network));

export const getReceiptRegistryContract = async network => getContract(RECEIPT_REGISTRY, network);
