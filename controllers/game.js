/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Defines a new express router.
 */
const GAME_ROUTER = EXPRESS.Router();

/**
 * The game index router.
 */
GAME_ROUTER.get('/', (request, response) => {

    response.send('A response from the game router!')
})

/**
 * Exports the module as a usable router by our application.
 */
module.exports = GAME_ROUTER;