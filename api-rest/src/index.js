// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import middleware from './middleware';
import api from './api';
import config from './config.json';

const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(
    cors({
        exposedHeaders: config.corsHeaders,
    }),
);

app.use(
    bodyParser.json({
        limit: config.bodyLimit,
    }),
);

// connect to db
const startServer = (model) => {
    // internal middleware
    app.use(middleware({ config, model }));

    // api router
    app.use('/api/v1', api({ config, model }));

    app.server.listen(process.env.PORT || config.port, () => {
        console.log(`Started on port ${app.server.address().port}`);
    });
};

startServer();

export default app;
