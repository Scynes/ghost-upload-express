/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * The express router reference for root.
 */
const ROOT_ROUTER = EXPRESS.Router();

/**
 * Renders the contact page.
 */
ROOT_ROUTER.get('/contact', (request, response) => {

    response.render('contact')
});

/**
 * Root redirection to landing page.
 */
ROOT_ROUTER.get('/', (request, response) => {

    response.redirect('/image/upload');
});

/**
 * Populates the database with mock data.
 */
ROOT_ROUTER.get('/seed', (request, response) => {
    
    GhostAccount.deleteMany( { }, error => {

        GhostAccount.create(SEED_DATA, (error, data) => {

            response.send(data);
        })
    });
});

/**
 * This route will display error handling pages based on the response code...
 */
ROOT_ROUTER.get('*', (request, response) => {

    response.render('error', {
        errorCode: response.statusCode,
        errorMessage: 'Just a default error response...:p',
    });
})

/**
 * Export the router for use.
 */
module.exports = ROOT_ROUTER;