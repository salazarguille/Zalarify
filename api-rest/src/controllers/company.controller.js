import {
    getCompanies,
    getAddress,
    getInfo,
} from '../services/zalarify.service';
import config from '../env';

const ETHEREUM_NETWORK = config.DEFAULT_ETHEREUM_NETWORK;

const CompanyController = {

    getAll: (network = ETHEREUM_NETWORK) => getCompanies(network),

    getAddress: (id, network = ETHEREUM_NETWORK) => getAddress(id, network),

    getInfo: (address, network = ETHEREUM_NETWORK) => getInfo(address, network),
};

export default CompanyController;
