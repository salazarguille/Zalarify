/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import {
    getServiceAPI,
} from '../lib/util';

export const getCurrencies = async (network) => {
    const api = getServiceAPI('KYBER_NETWORK', network);
    const url = `${api}/currencies`;
    const res = await axios.get(url);
    const payload = res.data.data.map(
        ({
            address, symbol, name, decimals,
        }) => ({
            address,
            symbol,
            name,
            decimals,
        }),
    );    
    return payload;
};
