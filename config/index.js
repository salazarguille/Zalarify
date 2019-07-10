const _ = require('lodash');
module.exports = (network) => {
	try {
		const networkConfig = require(`./${network}`);
		if (_.isNaN(networkConfig) || _.isUndefined(networkConfig) || _.isNull(networkConfig)) {
			throw new Error(`Config for network ${network} not found.`);
		}
		return networkConfig;
	} catch (error) {
        console.error(`Error loading configuration for ${network}`, error);
        throw error;
    }
};
