import { Router } from 'express';
import CompanyController from '../controllers/company.controller';
import { respondHttp } from '../lib/util';

export default ({ config, db }) => {
    const orders = Router();

    orders.get(
        '',
        respondHttp(CompanyController.getAll, req => [
            req.query.network,
        ]),
    );
    orders.get(
        '/:companyAddress',
        respondHttp(CompanyController.getInfo, req => [
            req.params.companyAddress,
            req.query.network,
        ]),
    );
    return orders;
};
