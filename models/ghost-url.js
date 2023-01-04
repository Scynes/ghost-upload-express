/**
 * Imports the mongoose modules.
 */
const MONGOOSE = require('mongoose');

/**
 * Holds the Schema object reference from the mongoose module.
 */
const Schema = MONGOOSE.Schema;

/**
 * Database document model for URL's...
 */
const GHOST_URL_SCHEMA = new Schema({

    _id: {
        type: String
    },

    image: {
        originalURL: {
            type: String,
            required: true
        }
    }

}, { timestamps: true, collection: 'urls'});

// Exports the schema for use.
module.exports = MONGOOSE.model('URL', GHOST_URL_SCHEMA);