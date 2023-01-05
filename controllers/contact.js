/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Import the ghost message schema.
 */
const GhostMessage = require('../models/ghost-message.js');

/**
 * The express router reference for root.
 */
const CONTACT_ROUTER = EXPRESS.Router();

/**
 * Renders the contact page.
 */
CONTACT_ROUTER.get('/', (request, response) => {

    response.render('contact')
});

/**
 * Post route for handling incoming message requests
 */
CONTACT_ROUTER.post('/', (request, response) => {

    GhostMessage.create(request.body, (error, message) => {

        if (error) return response.send(error);

        return response.send(message);
    });
})

/**
 * Export the router for use.
 */
module.exports = CONTACT_ROUTER;