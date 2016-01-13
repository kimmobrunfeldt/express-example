// This function eliminates boilerplate code in your express request handlers
// when using Promises in your own code.
// This also makes sure that you won't forget to call next with an error.
// `func` is your custom handler code and should always return a promise
function createJsonRoute(func) {
    return function route(req, res, next) {
        try {
            func(req, res)
                .then(result => res.json(result))
                .catch(next);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = {
    createJsonRoute: createJsonRoute
};
