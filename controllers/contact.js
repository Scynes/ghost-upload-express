/**
 * Express server module import.
 */
const { request, response } = require('express');
const EXPRESS = require('express');

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

CONTACT_ROUTER.post('/', (request, response) => {

    
})

/**
 * Export the router for use.
 */
module.exports = CONTACT_ROUTER;