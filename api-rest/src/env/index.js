
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const config = {

    // General Configuration
    DEFAULT_ETHEREUM_NETWORK: process.env.DEFAULT_ETHEREUM_NETWORK || 'homestead',
    THE_GRAPH_ITEMS_PER_PAGE: process.env.THE_GRAPH_ITEMS_PER_PAGE,

    // Ropsten Configuration
    ZALARIFY_ROPSTEN_ADDRESS: process.env.ZALARIFY_ROPSTEN_ADDRESS,
    RECEIPT_REGISTRY_ROPSTEN_ADDRESS: process.env.RECEIPT_REGISTRY_ROPSTEN_ADDRESS,
    STABLEPAY_ROPSTEN_ADDRESS: process.env.STABLEPAY_ROPSTEN_ADDRESS,
    STABLEPAY_STORAGE_ROPSTEN_ADDRESS: process.env.STABLEPAY_STORAGE_ROPSTEN_ADDRESS,
    
    STABLEPAY_ROPSTEN_API: process.env.STABLEPAY_ROPSTEN_API,
    KYBER_NETWORK_ROPSTEN_API: process.env.KYBER_NETWORK_ROPSTEN_API,
    KYBER_NETWORK_ROPSTEN_ADDRESS: process.env.KYBER_NETWORK_ROPSTEN_ADDRESS,
    THE_GRAPH_NETWORK_ROPSTEN_API: process.env.THE_GRAPH_NETWORK_ROPSTEN_API,

    // Mainnet Configuration
    ZALARIFY_MAINNET_ADDRESS: process.env.ZALARIFY_MAINNET_ADDRESS,
    RECEIPT_REGISTRY_MAINNET_ADDRESS: process.env.RECEIPT_REGISTRY_MAINNET_ADDRESS,
    STABLEPAY_MAINNET_ADDRESS: process.env.STABLEPAY_MAINNET_ADDRESS,
    STABLEPAY_STORAGE_MAINNET_ADDRESS: process.env.STABLEPAY_STORAGE_MAINNET_ADDRESS,
    KYBER_NETWORK_MAINNET_API: process.env.KYBER_NETWORK_MAINNET_API,
    STABLEPAY_MAINNET_API: process.env.STABLEPAY_MAINNET_API,
    THE_GRAPH_NETWORK_MAINNET_API: process.env.THE_GRAPH_NETWORK_MAINNET_API,
    KYBER_NETWORK_MAINNET_ADDRESS: process.env.KYBER_NETWORK_MAINNET_ADDRESS,

};

export default config;