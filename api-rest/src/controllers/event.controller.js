import axios from 'axios';
import _ from 'lodash';
import config from '../env';
import events from '../util/events';
import {
    buildPagination,
    buildCondition,
    buildQuery,
} from '../util/graphql';

import BadRequestError from '../lib/errors/BadRequestError';

const ETHEREUM_NETWORK = config.DEFAULT_ETHEREUM_NETWORK;
const {
    THE_GRAPH_NETWORK_ROPSTEN_API,
    THE_GRAPH_ITEMS_PER_PAGE,
} = config;

// eslint-disable-next-line max-len
const getEvents = async (eventName, params, order, where = undefined, page = 1, itemsPerPage = THE_GRAPH_ITEMS_PER_PAGE, network = ETHEREUM_NETWORK) => {
    if (_.isUndefined(eventName)) {
        throw new BadRequestError(`Event name ${eventName} is required.`);
    }
    const eventData = events(eventName);
    if (eventData === undefined) {
        throw new BadRequestError(`Event name ${eventName} is invalid.`);
    }
    const eventParams = params || eventData.params;

    const pagination = buildPagination(page, itemsPerPage);
    const condition = buildCondition(where);
    const query = buildQuery(eventData, order, pagination, condition, eventParams);

    const result = await axios.post(
        THE_GRAPH_NETWORK_ROPSTEN_API,
        JSON.stringify({
            query,
        }),
    );
    if (result.data.data !== undefined && result.data.errors === undefined) {
        const items = result.data.data[eventData.graph];
        console.log(items);
        const total = items.length > 0 ? ((page - 1) * itemsPerPage) + items.length : 0;
        return {
            success: true,
            count: {
                itemsPerPage,
                page,
                current: items.length,
                total,
            },
            data: items.map(item => ({
                ...item,
                blockTimestamp: item.blockTimestamp * 1000,
            })),
        };
    }
    return {
        success: false,
        query,
        errors: result.data.errors,
    };
};

const EventController = {
    getAll: async (event, page, itemsPerPage, network = ETHEREUM_NETWORK) => {
        const result = await getEvents(
            event,
            undefined,
            'orderBy: blockTimestamp, orderDirection: desc',
            undefined,
            page,
            itemsPerPage,
            network,
        );
        return result;
    },
};

export default EventController;
