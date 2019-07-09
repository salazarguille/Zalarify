/* eslint-disable new-cap */
import { ethers } from 'ethers';
import config from '../env';
import {
    HOMESTEAD,
    ROPSTEN,
    GANACHE,
    GANACHE_URL,
} from '../util/constants';

const getProvider = (network = config.DEFAULT_ETHEREUM_NETWORK) => {
    switch (network.toUpperCase()) {
        case HOMESTEAD:
            return new ethers.getDefaultProvider('homestead');
        case ROPSTEN:
            return new ethers.getDefaultProvider('ropsten');
        case GANACHE:
            return new ethers.providers.JsonRpcProvider(GANACHE_URL);
        default:
            return 'NETWORK_NOT_SUPPORTED';
    }
};


export default getProvider;
