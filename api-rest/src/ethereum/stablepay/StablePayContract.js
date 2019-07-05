import { ethers } from 'ethers';
import getProvider from '../ethers';
import { getContractAddress } from '../../lib/util';
import IProviderRegistry from '../abi/IProviderRegistry.json';
import StablePay from '../abi/IStablePay.json';
import {
    HOMESTEAD,
    ROPSTEN,
    STABLEPAY,
    PROVIDER_REGISTRY,
} from '../../util/constants';

function initContracts() {
    const stablepayMainnetContract = new ethers.Contract(getContractAddress(STABLEPAY, HOMESTEAD), StablePay.abi, getProvider(HOMESTEAD));
    const stablepayRopstenContract = new ethers.Contract(getContractAddress(STABLEPAY, ROPSTEN), StablePay.abi, getProvider(ROPSTEN));
    const storageMainnetContract = new ethers.Contract(getContractAddress(PROVIDER_REGISTRY, HOMESTEAD), IProviderRegistry.abi, getProvider(HOMESTEAD));
    const storageRopstenContract = new ethers.Contract(getContractAddress(PROVIDER_REGISTRY, ROPSTEN), IProviderRegistry.abi, getProvider(ROPSTEN));
    return {
        stablepayMainnetContract,
        stablepayRopstenContract,
        storageMainnetContract,
        storageRopstenContract,
    };
}

const getContract = async (service, network) => {
    const {
        stablepayMainnetContract,
        stablepayRopstenContract,
        storageMainnetContract,
        storageRopstenContract,
    } = initContracts();

    switch (service.toUpperCase()) {
        case STABLEPAY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return stablepayMainnetContract;
                case ROPSTEN:
                    return stablepayRopstenContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case PROVIDER_REGISTRY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return storageMainnetContract;
                case ROPSTEN:
                    return storageRopstenContract;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'CONTRACT_NOT_SUPPORTED';
    }
};

export default getContract;
