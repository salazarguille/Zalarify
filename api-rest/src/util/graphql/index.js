/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import BadRequestError from '../../lib/errors/BadRequestError';

export const buildPagination = (page, itemsPerPage) => {
    const skip = (page * itemsPerPage) - itemsPerPage;
    return `first: ${itemsPerPage}, skip: ${skip}`;
};

export const buildCondition = (where) => {
    const isWherePresent = !_.isUndefined(where);
    return isWherePresent ? `where: ${where}` : undefined;
};

export const buildQuery = (metadata, order, pagination, where, params) => {
    let internalParams = `{ ${metadata.graph}`;

    if (!_.isUndefined(pagination) || !_.isUndefined(where) || !_.isUndefined(order)) {
        internalParams += '(';
    }
    if (!_.isUndefined(order)) {
        internalParams += order;
    }

    if (!_.isUndefined(pagination)) {
        if (!_.isEmpty(internalParams)) {
            internalParams += ', ';
        }
        internalParams += pagination;
    }
    if (!_.isUndefined(where)) {
        internalParams += ', ';
        internalParams += where;
    }
    if (!_.isUndefined(pagination) || !_.isUndefined(where)) {
        internalParams += ')';
    }

    internalParams += ` { ${params} }}`;
    console.log('Query to execute: ', internalParams);

    return internalParams;
};

export const buildToAmountAndTimestampConditions = (direction, address, query) => {
    const {
        timestamp_gte,
        timestamp_lte,
        toAmount_gte,
        toAmount_lte,
    } = query;
    let condition = `${direction}: "${address.toString()}"`;

    if (!_.isUndefined(timestamp_gte) && !_.isUndefined(timestamp_lte)) {
        if (!_.gt(timestamp_lte, timestamp_gte)) {
            throw new BadRequestError(`Max timestamp ${timestamp_lte} must be greater than min timestamp ${timestamp_gte}.`);
        }
        condition += `, timestamp_gte: ${Math.floor(timestamp_gte / 1000)}, timestamp_lte: ${Math.floor(timestamp_lte / 1000)}`;
    }
    if (!_.isUndefined(toAmount_gte) && !_.isUndefined(toAmount_lte)) {
        if (!_.gt(toAmount_lte, toAmount_gte)) {
            throw new BadRequestError(`Max timestamp ${toAmount_lte} must be greater than min timestamp ${toAmount_gte}.`);
        }
        condition += `, toAmount_gte: "${toAmount_gte}", toAmount_lte: "${toAmount_lte}"`;
    }
    return condition;
};