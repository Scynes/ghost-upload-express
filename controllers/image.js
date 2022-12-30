/**
 * Express server module import.
 */
const EXPRESS = require('express');

/**
 * Defines a new express router.
 */
const IMAGE_ROUTER = EXPRESS.Router();

/**
 * Multer module import.
 */
const MULTER = require('multer');

/**
 * Imports the express rate limit module.
 */
const ERL = require('express-rate-limit');

/**
 * Import the node file system module for directory manipulation.
 */
const FILE_SYSTEM = require('fs');

/**
 * Defines the ERL middleware configuration options.
 */
const LIMITER = ERL({
    max: 1,
    windowsMS: 20000,
    message: 'You are sending too many requests! Try again shortly...'
});

/**
 * Constructs the storage engine for image uploads.
 */
const STORAGE_ENGINE = MULTER.diskStorage({

    // Will store uploaded images at the given path, or create one if a user is logged in..
    destination: (request, file, cb) => {
        const DIR = './public/storage/images/' + (request.session.isLoggedIn ? request.session.account.uid : '');

        if (FILE_SYSTEM.existsSync(DIR)) return cb(null, DIR);

        return FILE_SYSTEM.mkdir(DIR, error => cb(error, DIR));
    },

    filename: (request, file, cb) => {
        cb(null, file.originalname);
    }
});

/**
 * Instantiate the storage engine with multer.
 */
const IMAGE_UPLOAD = MULTER({
    storage: STORAGE_ENGINE,
    limits: {
        fileSize: 5000000
    }
});

/**
 * POST route for handling image uploading logic...
 */
IMAGE_ROUTER.post('/upload', [LIMITER, IMAGE_UPLOAD.single('image')], (request, response) => {

    return request.file ? response.send(request.file) : response.send( { error: 'There was a problem uploading your avatar!' } );
});

/**
 * The image index router.
 */
IMAGE_ROUTER.get('/', (request, response) => {

    response.render('index');
})

/**
 * Exports the module as a usable router by our application.
 */
module.exports = IMAGE_ROUTER;