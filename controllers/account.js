/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Defines a new express router.
 */
const ACCOUNT_ROUTER = EXPRESS.Router();

/**
 * Imports the schema for ghost accounts.
 */
const GhostAccount = require('../models/ghost-account.js');

/**
 * Import the hash utility methods.
 */
const ENCRYPTION = require('../scripts/hashing.js');

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
 * Handles new account creation via signup route.
 */
ACCOUNT_ROUTER.post('/signup', (request, response) => {

    const makeAccount = {
        loginCredentials: {},
        album: []
    };

    ENCRYPTION.generate(request.body.password).then(password => {

        makeAccount.loginCredentials.username = request.body.username;
        makeAccount.loginCredentials.password = password;

        GhostAccount.create(new GhostAccount(makeAccount), (error, account) => {

            if (!error) return response.send(account);

            response.send(error);
        });
    });
});

/**
 * handles login requests by checking if the account exists and if
 * the password submitted matches the account password (hashed)
 */
ACCOUNT_ROUTER.post('/login', (request, response) => {

    GhostAccount.findOne( { 'loginCredentials.username': request.body.username }, async (error, account) => {

        if (!account) return response.send('No account was found.');
        
        const passwordMatches = await ENCRYPTION.matches(request.body.password, account.loginCredentials.password);

        return response.send(passwordMatches ? `Account has succesfully logged in! ${account}` : 'The password was not correct')
    });
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