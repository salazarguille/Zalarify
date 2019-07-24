/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import Web3 from 'web3';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import getContract from '../ethereum/stablepay/StablePayContract';
import {
    getServiceAPI,
    toUnitAmount,
    toBaseAmount,
    getTokenDecimals,

} from '../lib/util';
import {
    DEFAULT_DECIMALS,
    PROVIDER_REGISTRY,
    KYBER_NETWORK_PROVIDER_KEY,
} from '../util/constants';

const { utils } = new Web3();

const BNFY = amount => ethers.utils.bigNumberify(amount.dp(0).toString());

export const getTokens = async (network) => {
    const api = getServiceAPI('STABLEPAY', network);

    const res = await axios.get(`${api}/tokens`);
    const payload = res.data.map(
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

export const getExpectedRates = async (
    sourceToken,
    targetToken,
    targetAmount,
    network,
) => {
    const contract = await getContract(PROVIDER_REGISTRY, network);
    const targetTokenDecimals = await getTokenDecimals(targetToken, network) || DEFAULT_DECIMALS;
    const sourceTokenDecimals = await getTokenDecimals(sourceToken, network) || DEFAULT_DECIMALS;

    const targetAmountBaseAmount = toBaseAmount(targetAmount, targetTokenDecimals);

    const kyberRate = await contract.getExpectedRate(
        KYBER_NETWORK_PROVIDER_KEY,
        sourceToken,
        targetToken,
        BNFY(targetAmountBaseAmount),
    );
    const bestRate = {
        ...kyberRate,
        providerKey: KYBER_NETWORK_PROVIDER_KEY,
    };
    const {
        minRate,
        maxRate,
        providerKey,
    } = bestRate;

    const payload = {
        maxRate: maxRate.toString(),
        maxRateUnit: toUnitAmount(maxRate, sourceTokenDecimals),
        minRate: minRate.toString(),
        minRateUnit: toUnitAmount(minRate, sourceTokenDecimals),
        targetAmount: targetAmountBaseAmount,
        provider: utils.hexToString(providerKey),
        providerKey,
    };
    return payload;
};
