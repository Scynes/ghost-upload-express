/**
 * Imports the mongoose modules.
 */
const MONGOOSE = require('mongoose');

/**
 * Holds the Schema object reference from the mongoose module.
 */
const Schema = MONGOOSE.Schema;

/**
 * Database document model for contact messages...
 */
const GHOST_MESSAGE_SCHEMA = new Schema({

    fullName: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    subject: {
        type: String,
        require: true
    },

    message: {
        type: String,
        require: true
    }

}, { timestamps: true, collection: 'messages'});

// Exports the schema for use.
module.exports = MONGOOSE.model('Messages', GHOST_MESSAGE_SCHEMA);