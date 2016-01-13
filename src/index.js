var createApp = require('./app');

var server = app.listen(process.env.PORT, () => {
    logger.info(
        'Express server listening on port %d in %s mode',
        process.env.PORT,
        app.get('env')
    );
});
