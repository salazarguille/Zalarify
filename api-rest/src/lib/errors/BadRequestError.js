/* eslint-disable global-require */
module.exports = class BadRequestError extends require('./AppError') {
    constructor(message) {
        // Providing default message and overriding status code.
        super(message || 'Invalid Request', 400);
    }
};
