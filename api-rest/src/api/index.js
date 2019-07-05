import { Router } from 'express';
import { version } from '../../package.json';
import tokenRoutes from './token.routes';
import companyRoutes from './company.routes';

export default ({ config, model }) => {
    const api = Router();

    api.get('/', (req, res) => {
        res.json({ version });
    });

    api.use('/tokens', tokenRoutes({ config, model }));
    api.use('/companies', companyRoutes({ config, model }));

    return api;
};
