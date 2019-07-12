import { Router } from 'express';
import ReceiptController from '../controllers/receipt.controller';
import { respondHttp } from '../lib/util';

export default ({ config, db }) => {
    const tokens = Router();

    tokens.post(
        '/',
        respondHttp(ReceiptController.createReceipt, req => [
            req.body,
            req.query.network,
        ]),
    );
    tokens.get(
        '/:companyAddress/employees/:employeeAddress',
        respondHttp(ReceiptController.getAll, req => [
            req.params.companyAddress,
            req.params.employeeAddress,
            req.query.network,
        ]),
    );
    tokens.get(
        '/:fileHash',
        respondHttp(ReceiptController.getReceipt, req => [
            req.params.fileHash,
            req.query.network,
        ]),
    );
    return tokens;
};
