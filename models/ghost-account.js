/**
 * Imports the mongoose modules.
 */
const MONGOOSE = require('mongoose');

/**
 * Holds the Schema object reference from the mongoose module.
 */
const Schema = MONGOOSE.Schema;

/**
 * Database document model for Ghost account details.
 */
const GHOST_ACC_SCHEMA = new Schema({

    avatar : {
        type: String,
        required: true
    },
    apiAccess: {
        key: {
            type: String,
        },
        expiration: {
            type: String,
        }
    },
    loginCredentials: {
        
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        session: {
            type: String
        }
    },
    album: [
        {
            imageUID: {
                type: String,
                required: true
            },
            imageType: {
                type: String,
                required: true
            }
        }
    ],
}, { timestamps: true, collection: 'accounts'});

// Exports the schema for use.
module.exports = MONGOOSE.model('Ghost', GHOST_ACC_SCHEMA);