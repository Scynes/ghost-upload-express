/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Mongoose database module import.
 */
const MONGOOSE = require('mongoose');

/**
 * Configures application system variables.
 */
const ENV = require('dotenv').config();

/**
 * The web server express instance.
 */
const WEB_SERVER = EXPRESS();

/**
 * The port number to listen for connections on.
 */
const LISTENING_PORT = process.env.LISTENING_PORT || 3001;

/**
 * Sets up the initial application.
 */
const buildWebServer = () => {

    // Sets the view engine to read ejs files.
    WEB_SERVER.set('view engine', 'ejs');
    // Sets the public css folder static access.
    WEB_SERVER.use(EXPRESS.static('public/css'));
    // Sets the path for js controllers static access.
    WEB_SERVER.use(EXPRESS.static('controllers'));
    // Sets the body parser.
    WEB_SERVER.use(EXPRESS.urlencoded( { extended: true } ));

    WEB_SERVER.listen(LISTENING_PORT, () => {
        console.log(`Ghost application is now running on port: ${LISTENING_PORT}...`);
    })
}

// Invoke the build method to start the application..
buildWebServer();