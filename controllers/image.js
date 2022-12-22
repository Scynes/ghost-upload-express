/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Defines a new express router.
 */
const IMAGE_ROUTER = EXPRESS.Router();

/**
 * The image index router.
 */
IMAGE_ROUTER.get('/', (request, response) => {

    response.render('index');
})

/**
 * Exports the module as a usable router by our application.
 */
module.exports = IMAGE_ROUTER;