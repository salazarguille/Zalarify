import {
    receiptRegistry,
    zalarify,
    settings,
} from './names';

const createEventData = (eventName, graphName, params) => {
    return {
        name: eventName,
        graph: graphName,
        params,
    };
};

const addData = (map, eventName, graphName, params) => {
    map.set(eventName.toLowerCase(), createEventData(eventName, graphName, params));
};

const map = new Map();

// IReceiptRegistry
addData(map, receiptRegistry.newReceiptCreated, 'newReceiptCreateds', 'id thisContract company employee receiptHash path blockTimestamp blockHash blockGasLimit blockGasUsed blockNumber txInput txValue txGasPrice txGasUsed txHash');

// IZalarify
addData(map, zalarify.newCompanyCreated, 'newCompanyCreateds', 'id thisContract companyAddress createdAt creator blockTimestamp blockHash blockGasLimit blockGasUsed blockNumber txInput txValue txGasPrice txGasUsed txHash');

// ISettings
addData(map, settings.platformPaused, 'platformPauseds', 'id thisContract reason blockTimestamp blockHash blockGasLimit blockGasUsed blockNumber txInput txValue txGasPrice txGasUsed txHash');
addData(map, settings.platformUnpaused, 'platformUnpauseds', 'id thisContract reason blockTimestamp blockHash blockGasLimit blockGasUsed blockNumber txInput txValue txGasPrice txGasUsed txHash');

export default (eventName) => {
    return map.get(eventName.toLowerCase());
};
