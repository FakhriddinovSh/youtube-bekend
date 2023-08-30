const multer = require('multer');
const photoUpload = multer();

const router = require('express').Router();
const controller = require('../controllers/authController');

router.post('/register', photoUpload.single('file'), controller.REGISTER);
router.post('/login', controller.LOGIN);

module.exports = router;
