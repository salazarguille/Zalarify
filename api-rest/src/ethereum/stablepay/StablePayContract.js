import { ethers } from 'ethers';
import getProvider from '../ethers';
import { getContractAddress } from '../../lib/util';
import AppError from '../../lib/errors/AppError';
import IProviderRegistry from '../abi/IProviderRegistry.json';
import StablePay from '../abi/IStablePay.json';
import {
    HOMESTEAD,
    ROPSTEN,
    GANACHE,
    STABLEPAY,
    PROVIDER_REGISTRY,
} from '../../util/constants';

function initContracts(network) {
    let storageGanacheContract;
    let stablepayGanacheContract;
    let stablepayRopstenContract;
    let storageRopstenContract;
    if (network.toUpperCase() === GANACHE) {
        stablepayGanacheContract = new ethers.Contract(getContractAddress(STABLEPAY, GANACHE), StablePay.abi, getProvider(GANACHE));
        storageGanacheContract = new ethers.Contract(getContractAddress(PROVIDER_REGISTRY, GANACHE), IProviderRegistry.abi, getProvider(GANACHE));
    }

    if (network.toUpperCase() === ROPSTEN) {
        stablepayRopstenContract = new ethers.Contract(getContractAddress(STABLEPAY, ROPSTEN), StablePay.abi, getProvider(ROPSTEN));
        storageRopstenContract = new ethers.Contract(getContractAddress(PROVIDER_REGISTRY, ROPSTEN), IProviderRegistry.abi, getProvider(ROPSTEN));
    }
    
    return {
        stablepayRopstenContract,
        storageRopstenContract,
        stablepayGanacheContract,
        storageGanacheContract,
    };
}

const getContract = async (service, network) => {
    const {
        stablepayRopstenContract,
        storageRopstenContract,
        stablepayGanacheContract,
        storageGanacheContract,
    } = initContracts(network);

    switch (service.toUpperCase()) {
        case STABLEPAY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    throw new AppError('Zalarify is not on Mainnet.');
                case ROPSTEN:
                    return stablepayRopstenContract;
                case GANACHE:
                    return stablepayGanacheContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case PROVIDER_REGISTRY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    throw new AppError('Zalarify is not on Mainnet.');
                case ROPSTEN:
                    return storageRopstenContract;
                case GANACHE:
                    return storageGanacheContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'CONTRACT_NOT_SUPPORTED';
    }
};

export default getContract;
