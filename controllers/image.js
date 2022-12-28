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
 * Constructs the storage engine for image uploads.
 */
const STORAGE_ENGINE = MULTER.diskStorage({
    destination: './public/images/',
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

IMAGE_ROUTER.post('/upload', IMAGE_UPLOAD.single('image'), (request, response) => {

    if (request.file) {
        response.send(request.file);
    }
});

/**
 * The image index router.
 */
IMAGE_ROUTER.get('/', (request, response) => {

    response.render('index',    
    {
        avatar: request.session.isLoggedIn ? request.session.account.avatar : 'https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg'
    });
})

/**
 * Exports the module as a usable router by our application.
 */
module.exports = IMAGE_ROUTER;