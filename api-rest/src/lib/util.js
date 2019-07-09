import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import getTokenContract from '../ethereum/erc20/Erc20Contract';
import config from '../env';
import {
    HOMESTEAD,
    ROPSTEN,
    GANACHE,
    ETHEREUM_TOKEN_ADDR,
    STABLEPAY,
    PROVIDER_REGISTRY,
    ZALARIFY,
    RECEIPT_REGISTRY,
} from '../util/constants';
import BadRequestError from './errors/BadRequestError';

/**
 * Handles controller execution and responds to an api route call.
 * @param promise Controller Promise.
 * @param params A function (req, res, next), all of which are optional.
 * that maps our desired controller parameters.
 */
export const respondHttp = (promise, params) => async (req, res, next) => {
    const boundParams = params ? params(req, res, next) : [];
    try {
        const result = await promise(...boundParams);
        return res.status(200).send(result || { message: 'Ok' });
    } catch (error) {
        console.log(error);
        if (error instanceof BadRequestError) {
            return res.status(400).send({
                message: error.message,
            });
        }
        // unexpected error
        return res.status(500).send({
            message: 'An unexpected error occurred.',
        });
    }
};

export const getServiceAPI = (service, network) => {
    switch (service.toUpperCase()) {
        case 'KYBER_NETWORK':
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.KYBER_NETWORK_MAINNET_API;
                case ROPSTEN:
                    return config.KYBER_NETWORK_ROPSTEN_API;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case STABLEPAY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.STABLEPAY_MAINNET_API;
                case ROPSTEN:
                    return config.STABLEPAY_ROPSTEN_API;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'SERVICE_NOT_SUPPORTED';
    }
};

export const getContractAddress = (service, network) => {
    switch (service.toUpperCase()) {
        case 'KYBER_NETWORK':
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.KYBER_NETWORK_MAINNET_ADDRESS;
                case ROPSTEN:
                    return config.KYBER_NETWORK_ROPSTEN_ADDRESS;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case STABLEPAY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.STABLEPAY_MAINNET_ADDRESS;
                case ROPSTEN:
                    return config.STABLEPAY_ROPSTEN_ADDRESS;
                case GANACHE:
                    return config.STABLEPAY_GANACHE_ADDRESS;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case PROVIDER_REGISTRY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.STABLEPAY_STORAGE_MAINNET_ADDRESS;
                case ROPSTEN:
                    return config.STABLEPAY_STORAGE_ROPSTEN_ADDRESS;
                case GANACHE:
                    return config.STABLEPAY_STORAGE_GANACHE_ADDRESS;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case RECEIPT_REGISTRY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.RECEIPT_REGISTRY_MAINNET_ADDRESS;
                case ROPSTEN:
                    return config.RECEIPT_REGISTRY_ROPSTEN_ADDRESS;
                case GANACHE:
                    return config.RECEIPT_REGISTRY_GANACHE_ADDRESS;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        case ZALARIFY:
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return config.ZALARIFY_MAINNET_ADDRESS;
                case ROPSTEN:
                    return config.ZALARIFY_ROPSTEN_ADDRESS;
                case GANACHE:
                    return config.ZALARIFY_GANACHE_ADDRESS;
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'CONTRACT_NOT_SUPPORTED';
    }
};

export const getTokenAddress = (token, network) => {
    switch (token.toUpperCase()) {
        case 'DAI':
            switch (network.toUpperCase()) {
                case HOMESTEAD:
                    return '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
                case ROPSTEN:
                    return '0xad6d458402f60fd3bd25163575031acdce07538d';
                default:
                    return 'NETWORK_NOT_SUPPORTED';
            }
        default:
            return 'CONTRACT_NOT_SUPPORTED';
    }
};

export const toBN = amount => new BigNumber(amount);
export const BNFY = amount => ethers.utils.bigNumberify(new BigNumber(amount).dp(0).toString());

export const toUnitAmount = (amount, decimals = 18) => {
    const aUnit = new BigNumber(10).pow(decimals);
    const unit = new BigNumber(amount).div(aUnit);
    return unit.toNumber();
};

export const toBaseAmount = (amount, decimals = 18) => {
    const unit = new BigNumber(10).pow(decimals);
    const baseUnitAmount = new BigNumber(amount).times(unit);
    return baseUnitAmount;
};

export const getTokenDecimals = async (tokenAddress, network = HOMESTEAD) => {
    if (!tokenAddress) {
        throw new Error('getTokenDecimals: expected valid token address reference');
    }

    if (tokenAddress === ETHEREUM_TOKEN_ADDR) {
        return 18;
    }

    const tokenContract = await getTokenContract(tokenAddress, network);

    const decimals = await tokenContract.decimals();

    return decimals;
};

export const isAddress = (address) => {
    try {
        const formattedAddress = ethers.utils.getAddress(address);
        if (formattedAddress) return true;

        return false;
    } catch (err) {
        // not an ethereum address
        return false;
    }
};
