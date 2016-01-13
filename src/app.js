var http = require('http');
var express = require('express');
var createRouter = require('./router');

// We are taking some inputs directly out from process.env.
// One improvement here would be so that createApp would take all inputs
// as parameters so that the only entrypoint for any configuration to the
// express app would be through the parameters.
function createApp() {
    const app = express();

    // TODO: add express middlewares such as body parser etc here.

    // Initialize routes
    const router = createRouter();
    app.use('/api', router);

    app.use(function errorLogger(err, req, res, next) {
        const status = err.status ? err.status : 500;

        if (status >= 400) {
            console.error('Request headers:');
            console.error(JSON.stringify(req.headers));
            console.error('Request parameters:');
            console.error(JSON.stringify(req.params));
        }

        if (process.env.NODE_ENV === 'test' && status >= 500 ||
            process.env.NODE_ENV === 'development'
        ) {
            console.log(err.stack);
        }

        next(err);
    });

    app.use(function errorResponder(err, req, res, next) {
        const status = err.status ? err.status : 500;
        const httpMessage = http.STATUS_CODES[status];

        let message;
        if (status < 500) {
            message = httpMessage + ': ' + err.message;
        } else {
            message = httpMessage;
        }

        let response = {message: message};
        if (err.data) {
            response.errors = err.data;
        }

        res.status(status);
        res.send(response);
    });

    // Why a createApp function?
    // Implementing tests are much easier when you can create a new instance
    // of the express app at any point.
    return app;
}

module.exports = createApp
