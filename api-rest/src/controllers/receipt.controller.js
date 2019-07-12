import config from '../env';
import {
    createReceipt,
    getReceipt,
    getAll,
} from '../services/receipt.service';

const ETHEREUM_NETWORK = config.DEFAULT_ETHEREUM_NETWORK;

const ReceiptController = {

    createReceipt: async (input, network = ETHEREUM_NETWORK) => {
        const response = await createReceipt(input, network);
        return response;
    },
    getReceipt: async (fileHash, network = ETHEREUM_NETWORK) => {
        const response = await getReceipt(fileHash, network);
        return response;
    },
    getAll: async (companyAddress, employeeAddress, network = ETHEREUM_NETWORK) => {
        const response = await getAll(companyAddress, employeeAddress, network);
        return response;
    },
};

export default ReceiptController;
