import { Router } from 'express';
import EventController from '../controllers/event.controller';
import { respondHttp } from '../lib/util';

export default ({ config }) => {
    const events = Router();

    events.get(
        '',
        respondHttp(EventController.getAll, req => [
            req.query.eventName,
            req.query.page,
            req.query.itemsPerPage,
            req.query.network,
        ]),
    );
    return events;
};
