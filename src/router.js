var express = require('express');
var usersEndpoint = require('./users-endpoint');

function createRouter() {
    const router = express.Router();

    router.get('/users/:userId', usersEndpoint.getUser);

    // Usually I make an endpoint file per REST resource
    // For example notes resource would be a new file: notes-endpoint.js
    // router.get('/notes/:noteId', notesEndpoint.getNote);

    return router;
}

module.exports = createRouter;
