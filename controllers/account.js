/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Defines a new express router.
 */
const ACCOUNT_ROUTER = EXPRESS.Router();

/**
 * The account index router.
 */
ACCOUNT_ROUTER.get('/', (request, response) => {
    //TODO: Add a session check if not logged in, reroute to signup...
    response.redirect('/account/signup');
});

/**
 * The router that handles account signup requests.
 */
ACCOUNT_ROUTER.get('/signup', (request, response) => {

    response.render('signup');
});

/**
 * The router that handles account login requests.
 */
ACCOUNT_ROUTER.get('/login', (request, response) => {

    response.render('login');
});

/**
 * Exports the module as a usable router by our application.
 */
module.exports = ACCOUNT_ROUTER;