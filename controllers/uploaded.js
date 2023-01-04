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

    GhostURL.findById(request.params.id, (error, imageURL) => {

        if (!imageURL) return response.send('No image was located..')

        return response.render('image', { imagePath: `/img/${imageURL.image.originalURL}` } );
    });
});

/**
 * Exports the UPLOADED_ROUTER for use.
 */
module.exports = UPLOADED_ROUTER;