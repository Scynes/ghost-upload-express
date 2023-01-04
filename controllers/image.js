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
 * Imports the schema for ghost accounts.
 */
const GhostAccount = require('../models/ghost-account.js');

/**
 * Imports the schema for ghost urls.
 */
const GhostURL = require('../models/ghost-url.js');

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
    max: 5,
    windowsMS: 20000,
    message: 'You are sending too many requests! Try again shortly...'
});

/**
 * Constructs the storage engine for image uploads.
 */
const STORAGE_ENGINE = MULTER.diskStorage({

    // Will store uploaded images at the given path, or create one if a user is logged in..
    destination: (request, file, cb) => {
        const DIR = './public/storage/images/' + (request.session.isLoggedIn ? request.session.account.uid : 'anonymous/');

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
 * Writes a shortened URL reference id to the database.
 * 
 * @param {*} image 
 * @returns 
 */
const writeImageURL = async (image, path) => {

    const result = await GhostURL.create(new GhostURL( { image: { originalURL: `${path}/${image.originalname}` } } ));

    return result;
}

/**
 * POST route for handling image uploading logic...
 */
IMAGE_ROUTER.post('/upload', [LIMITER, IMAGE_UPLOAD.single('image')], async (request, response) => {
    const BASE_PATH = request.session.isLoggedIn ? request.session.account.uid : 'anonymous';

    const data = await writeImageURL(request.file, BASE_PATH);

    return request.file ? response.send( { path: `/img/${BASE_PATH}/${request.file.originalname}`, url: data } ) : response.send( { error: 'There was a problem uploading your image!' } );
});

/**
 * POST route for handling avatar uploading logic...
 */
IMAGE_ROUTER.post('/avatar', [LIMITER, IMAGE_UPLOAD.single('avatar')], (request, response) => {

    if (!request.file) return response.send( { error: 'There was a problem uploading your avatar!' } );

    GhostAccount.findByIdAndUpdate(request.session.account.uid, { 'avatar' : request.file.filename }, { new: true }, (error, account) => {

        if (error) return response.send(error);

        response.send( { updatedAvatar: `${account._id}/${request.session.account.avatar = account.avatar} `} );
    });
});

/**
 * The image index router.
 */
IMAGE_ROUTER.get('/upload', (request, response) => {

    response.render('upload');
})

/**
 * Exports the module as a usable router by our application.
 */
module.exports = IMAGE_ROUTER;