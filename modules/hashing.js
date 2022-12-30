/**
 * Imports the bcrypt hashing modules.
 */
const HASHER = require('bcrypt');

/**
 * Import node native crypto library.
 */
const CRYPTO = require('crypto');

module.exports = {

    /**
     * Returns a randomly generated API key.
     */
    generateAPIKey: () => {

        const BUFFER = CRYPTO.randomBytes(32);

        return BUFFER.toString('base64').replace('=', '');
    },

    /**
     * Returns a hashed string using bcrypt of the input passed.
     * 
     * @param {*} input
     */
    generate: input => {

        return HASHER.hash(input, 10);
    },

    /**
     * Returns a boolean state if the input string hashed matches
     * the cimparable against hash.
     * 
     * @param {*} input 
     * @param {*} against 
     * @returns 
     */
    matches: (input, against) => {

        return HASHER.compare(input, against);
    }
}