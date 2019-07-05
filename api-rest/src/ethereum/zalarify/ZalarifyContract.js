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
    RECEIPT_REGISTRY,
} from '../../util/constants';

function initContracts() {
    // const zalarifyMainnetContract = new ethers.Contract(getContractAddress(ZALARIFY, HOMESTEAD), IZalarify.abi, getProvider(HOMESTEAD));
    const zalarifyRopstenContract = new ethers.Contract(getContractAddress(ZALARIFY, ROPSTEN), IZalarify.abi, getProvider(ROPSTEN));
    // const receiptRegistryMainnetContract = new ethers.Contract(getContractAddress(RECEIPT_REGISTRY, HOMESTEAD), IReceiptRegistry.abi, getProvider(HOMESTEAD));
    const receiptRegistryRopstenContract = new ethers.Contract(getContractAddress(RECEIPT_REGISTRY, ROPSTEN), IReceiptRegistry.abi, getProvider(ROPSTEN));
    return {
        // zalarifyMainnetContract,
        zalarifyRopstenContract,
        // receiptRegistryMainnetContract,
        receiptRegistryRopstenContract,
    };
}

export const getContract = async (service, network) => {
    const {
        zalarifyRopstenContract,
        receiptRegistryRopstenContract,
    } = initContracts();

    switch (service.toUpperCase()) {
        case ZALARIFY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    throw new AppError('Zalarify is not deployed on Mainnet.');
                case ROPSTEN:
                    return zalarifyRopstenContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case RECEIPT_REGISTRY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    throw new AppError('Zalarify is not deployed on Mainnet.');
                case ROPSTEN:
                    return receiptRegistryRopstenContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'CONTRACT_NOT_SUPPORTED';
    }
};

// eslint-disable-next-line max-len
export const getCompanyContract = async (address, network) => new ethers.Contract(address, IZalarifyCompany.abi, getProvider(network));
