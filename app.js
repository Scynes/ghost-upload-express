/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Express-session module import.
 */
const EXPRESS_SESSION = require('express-session');

/**
 * Mongoose database module import.
 */
const MONGOOSE = require('mongoose');

/**
 * Modules for holding session data in mongoDB.
 */
const MongoStore = require('connect-mongo');

/**
 * Configures application system variables.
 */
const ENV = require('dotenv').config();

/**
 * Imports the account router module.
 */
const ACCOUNT_ROUTER = require('./controllers/account.js');

/**
 * Imports the game router module.
 */
const GAME_ROUTER = require('./controllers/game.js');

/**
 * Imports the image router module.
 */
const IMAGE_ROUTER = require('./controllers/image.js')

/**
 * Imports the schema for ghost accounts.
 */
const GhostAccount = require('./models/ghost-account.js');

/**
 * Imports mock database data.
 */
const SEED_DATA = require('./seed_data.js');

/**
 * The web server express instance.
 */
const WEB_SERVER = EXPRESS();

/**
 * The port number to listen for connections on.
 */
const LISTENING_PORT = (process.env.PORT || process.env.LISTENING_PORT) || 3000;

/**
 * The URI to the remote mongo database.
 */
const DATABASE_URI = process.env.DATABASE_URI;

/**
 * Holds the name of the application, just because.
 */
const APP_NAME = process.env.APP_NAME || 'Ghostie';

/**
 * Holds the reference to the created database connection.
 */
let database = undefined;

/**
 * Custom middleware function for handling template injection if a user is authenticated.
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
const authenticated = (request, response, next) => {

    response.locals.isLoggedIn = request.session.isLoggedIn;
    response.locals.avatar = request.session.isLoggedIn ? `/avatar/${request.session.account.uid}/${request.session.account.avatar}` : 'https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg';
    response.locals.displayName = request.session.isLoggedIn ? request.session.account.accountName : 'Ghostie Guest';
    response.locals.apiKey = request.session.isLoggedIn ? request.session.account.apiKey : 'Error Rendering API Key...';

    return next();
}

/**
 * Binds the application view engines.
 */
const bindViewEngines = () => {

    // Sets the view engine to read ejs files.
    WEB_SERVER.set('view engine', 'ejs');

    console.log(`${APP_NAME} - successfully bound the view engines...`);
}

/**
 * Binds the application routers to the web server.
 */
const bindRouters = () => {

    // Sets the account router path.
    WEB_SERVER.use('/account', ACCOUNT_ROUTER);
    // Sets the image router path.
    WEB_SERVER.use('/image', IMAGE_ROUTER);
    // Sets the game router path.
    WEB_SERVER.use('/game', GAME_ROUTER);

    console.log(`${APP_NAME} - successfully bound the routers...`);
}

/**
 * Binds the application middleware to the web server.
 */
const bindMiddleware = () => {

    // Sets the public css folder static access.
    WEB_SERVER.use(EXPRESS.static('public/css'));
    // Sets the public css folder static access.
    WEB_SERVER.use('/avatar', EXPRESS.static('public/storage/images'));
    // Sets the public access for images access.
    WEB_SERVER.use('/images', EXPRESS.static('public/images'));
    // Sets the public css folder static access.
    WEB_SERVER.use(EXPRESS.static('public/scripts'));
    // Sets the scripts folder for static access.
    WEB_SERVER.use(EXPRESS.static('modules'));
    // Sets the path for js controllers static access.
    WEB_SERVER.use(EXPRESS.static('controllers'));
    // Sets the body parser.
    WEB_SERVER.use(EXPRESS.urlencoded( { extended: true } ));
    // Sets the express session variables.
    WEB_SERVER.use(EXPRESS_SESSION( 
        { 
            store: MongoStore.create( { mongoUrl: DATABASE_URI } ),
            secret: process.env.SECRET, 
            resave: false, 
            saveUninitialized: false,
            cookie: {
                maxAge: (1000 * 60 * 60 * 24 * 7 * 2)
            }
        })
    );
    // Sets the authentication global var middleware.
    WEB_SERVER.use(authenticated);

    console.log(`${APP_NAME} - successfully bound the middleware...`);
}

/**
 * Establishes connection to the mongo database.
 */
const bindMongoDatabase = () => {

    // Deprecated suppression
    MONGOOSE.set('strictQuery', true);
    // Attempts to connect to the mongo database.
    MONGOOSE.connect(DATABASE_URI);
    // Assignes the connection reference.
    database = MONGOOSE.connection;
    // Handles database on error events when connecting.
    database.on('error', (error) => console.log(`${APP_NAME} - an error has occured while connecting to MongoDB - ${error.message}...`));
    // Handles database on connected events when connecting.
    database.on('connected', () => {
        console.log(`${APP_NAME} - mongoDB successfully connected on ${database.host}:${database.port}...`)

        // Start listening when database is connected...
        WEB_SERVER.listen(LISTENING_PORT, () => {

            console.log(`${APP_NAME} - now running on port: ${LISTENING_PORT}...`);
        })
    });

    console.log(`${APP_NAME} - attempting to connect to MongoDB...`);
}

/**
 * Sets up the initial application.
 */
const buildWebServer = () => {

    bindViewEngines();
    bindMiddleware();
    bindRouters();
    bindMongoDatabase();
}

// Invoke the build method to start the application..
buildWebServer();

/**
 * Populates the database with mock data.
 */
WEB_SERVER.get('/seed', (request, response) => {
    
    GhostAccount.deleteMany( { }, error => {

        GhostAccount.create(SEED_DATA, (error, data) => {

            response.send(data);
        })
    });
})

/**
 * Root redirection to landing page.
 */
WEB_SERVER.get('/', async (request, response) => {

    response.render('error', {
        errorCode: 503,
        errorMessage: 'Under Construction! <(o.O<)',
    });
});

/**
 * This route will display error handling pages based on the response code...
 */
WEB_SERVER.get('*', (request, response) => {

    response.render('error', {
        errorCode: response.statusCode,
        errorMessage: 'Just a default error response...:p',
    });
})