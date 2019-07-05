import { ethers } from 'ethers';
import config from '../env';
import { HOMESTEAD, ROPSTEN } from '../util/constants';

const mainnetProvider = new ethers.getDefaultProvider('homestead');
const ropstenProvider = new ethers.getDefaultProvider('ropsten');

const getProvider = (network = config.DEFAULT_ETHEREUM_NETWORK) => {
    switch (network.toUpperCase()) {
        case HOMESTEAD:
            return mainnetProvider;
        case ROPSTEN:
            return ropstenProvider;
        default:
            return 'NETWORK_NOT_SUPPORTED';
    }
};


export default getProvider;
