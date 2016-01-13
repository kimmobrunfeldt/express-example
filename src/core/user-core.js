// TODO: Add a knex instance and configuration for it
var knex = require('./our-configured-knex-instance');

// All core methods return promises so that interacting with and chaining them
// is easier.
// You might need to use the same core function from multiple places in the code
// base.
// Consider these core methods as "generic" providers to read/write
// to your database. They can be used even though the request came via HTTP,
// websocket, socket or any other mechanism.
// They might be used from a worker task etc.
// Core function takes precise and minimal input to get the action done.
// You're doing something wrong if you pass e.g. express' `req` object here.
// Core functions should return JSON serializable JS objects.
// If you are using e.g. Bookshelf models, you should not reveal the model
// details outside to the other layers of code. You should keep these functions
// clean in that sense.
function getUserById(userId) {
    return knex
        .select('*')
        .from('users')
        .where({
            // NOTE: userId is UNTRUSTED input, you should ALWAYS
            // use proper methods to prevent SQL injections.
            // In this case knex will take care of that when we use the where
            // function. With knex.raw, you should use ? escaping.
            id: userId
        })
        .limit(1)
        .then(function(rows) {
            if (_.isEmpty(rows)) {
                return null;
            }

            return _userRowToUserObject(rows[0]);
        });
}

function _userRowToUserObject(row) {
    // This conversion could be also separated to a more generic util function
    // which automatically converts snake_case to -> camelCase etc.
    return {
        id: row.id,
        name: row.name,
        // Convert db convention to js camelcase
        fullAddress: row['full_address']
    };
}

module.exports = {
    getUserById: getUserById
};
