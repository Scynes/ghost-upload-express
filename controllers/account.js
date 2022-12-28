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
 * Imports the constant object for passing on page renders.
 */
const GHOST_RENDER_CONSTANTS = require('../models/ghost-render-contants.js');

/**
 * The account index router.
 */
ACCOUNT_ROUTER.get('/', (request, response) => {
    //TODO: Add a session check if not logged in, reroute to signup...
    response.redirect('/account/login');
});

/**
 * The router that handles account signup requests.
 */
ACCOUNT_ROUTER.get('/signup', (request, response) => {

    response.redirect('/account/login');
});

/**
 * Handles new account creation via signup route.
 */
ACCOUNT_ROUTER.post('/signup', (request, response) => {

    const makeAccount = {
        avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/96be2232163929.567197ac6fb64.png',
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
 * Handles login requests by checking if the account exists and if
 * the password submitted matches the account password (hashed)
 */
ACCOUNT_ROUTER.post('/login', (request, response) => {

    GhostAccount.findOne( { 'loginCredentials.username': request.body.username }, async (error, account) => {

        if (!account) return response.send(
            {
                error: 'No account was found.'
            }
        );
        
        await ENCRYPTION.matches(request.body.password, account.loginCredentials.password).then( match => {

            if (!match) return response.send(
                {
                    error: 'The password was not correct!'
                }
            );

            request.session.isLoggedIn = true;
            request.session.account = {
                accountName: account.loginCredentials.username,
                avatar: account.avatar,
                uid: account._id
            }

            return response.send(account)
        });
    });
});

/**
 * The route that handles account login requests.
 */
ACCOUNT_ROUTER.get('/login', (request, response) => {

    console.log(ENCRYPTION.generateAPIKey());

    if (request.session.isLoggedIn) return response.redirect('/account/profile');

    response.render('login', Object.assign(
        {

        },
        GHOST_RENDER_CONSTANTS(request))
    );
});

/**
 * Handles logging a user out and destroying the session if it exists.
 */
ACCOUNT_ROUTER.get('/logout', (request, response) => {

    if (!request.session.isLoggedIn) return response.redirect('/account/login');

        
    request.session.destroy();
    response.clearCookie('connect.sid');
    response.send('Logged out...');
});

/**
 * The route that handles access to an accounts profile page.
 */
ACCOUNT_ROUTER.get('/profile', (request, response) => {

    // If the account is not logged in send them to the login page
    if (!request.session.isLoggedIn) return response.redirect('/account/login');

    response.render('profile', Object.assign(
        {

        },
        GHOST_RENDER_CONSTANTS(request))
    );
});

/**
 * PATCH request route for generating a new API key for a user.
 */
ACCOUNT_ROUTER.patch('/profile/apikey', (request, response) => {

    if (!request.session.isLoggedIn) return response.send( { error: 'You must be logged in to perform this action!' } );

    GhostAccount.findByIdAndUpdate(request.session.account.uid, {
        apiAccess: {
            key: ENCRYPTION.generateAPIKey()
        }
    }, { new: true }, (error, account) => {

        response.send({ apiKey: account.apiAccess.key });
    })
});

/**
 * Exports the module as a usable router by our application.
 */
module.exports = ACCOUNT_ROUTER;