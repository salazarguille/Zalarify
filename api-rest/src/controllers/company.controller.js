/* eslint-disable max-len */
import {
    getCompanies,
    getAddress,
    getInfo,
    getEmployee,
} from '../services/zalarify.service';
import config from '../env';

const ETHEREUM_NETWORK = config.DEFAULT_ETHEREUM_NETWORK;

const CompanyController = {

    getAll: (network = ETHEREUM_NETWORK) => getCompanies(network),

    getAddress: (id, network = ETHEREUM_NETWORK) => getAddress(id, network),

    getInfo: (address, network = ETHEREUM_NETWORK) => getInfo(address, network),

    getEmployee: (companyAddress, employeeAddress, network = ETHEREUM_NETWORK) => getEmployee(companyAddress, employeeAddress, network),
};

export default CompanyController;
