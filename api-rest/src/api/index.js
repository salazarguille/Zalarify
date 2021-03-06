import { Router } from 'express';
import { version } from '../../package.json';
import tokenRoutes from './token.routes';
import companyRoutes from './company.routes';
import receiptRoutes from './receipt.routes';
import eventRoutes from './event.routes';

export default ({ config, model }) => {
    const api = Router();

    api.get('/', (req, res) => {
        res.json({ version });
    });

    api.use('/tokens', tokenRoutes({ config, model }));
    api.use('/companies', companyRoutes({ config, model }));
    api.use('/receipts', receiptRoutes({ config, model }));
    api.use('/events', eventRoutes({ config, model }));

    return api;
};
