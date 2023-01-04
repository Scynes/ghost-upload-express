/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Imports the schema for ghost urls.
 */
const GhostURL = require('../models/ghost-url.js');

/**
 * Defines a new express router.
 */
const UPLOADED_ROUTER = EXPRESS.Router();

/**
 * Gets the image by shortened id (if it exists).
 */
UPLOADED_ROUTER.get('/:id', (request, response) => {

    response.send(request.params.id)
});

/**
 * Exports the UPLOADED_ROUTER for use.
 */
module.exports = UPLOADED_ROUTER;