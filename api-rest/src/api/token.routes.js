import { Router } from 'express';
import TokenController from '../controllers/token.controller';
import { respondHttp } from '../lib/util';

export default ({ config, db }) => {
    const tokens = Router();

    tokens.get(
        '/',
        respondHttp(TokenController.getAll, req => [
            req.params.toReceivePayments,
            req.query.network,
        ]),
    );

    tokens.get(
        '/receivePayments',
        respondHttp(TokenController.getBySymbolOrAddress, req => [
            'DAI',
            req.query.network,
        ]),
    );

    tokens.get(
        '/:symbolOrAddress',
        respondHttp(TokenController.getBySymbolOrAddress, req => [
            req.params.symbolOrAddress,
            req.query.network,
        ]),
    );

    tokens.get(
        '/:symbolOrAddress/rate/',
        respondHttp(TokenController.getExpectedRate, req => [
            req.params.symbolOrAddress,
            req.query.network,
            // to support query arguments as well as params
            req.query.target,
        ]),
    );

    tokens.get(
        '/:symbolOrAddress/rate/:targetSymbolOrAddress',
        respondHttp(TokenController.getExpectedRate, req => [
            req.params.symbolOrAddress,
            req.query.network,
            req.params.targetSymbolOrAddress,
        ]),
    );

    return tokens;
};
