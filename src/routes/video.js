const multer = require('multer');
const router = require('express').Router();
const controller = require('../controllers/videoController');
const videoUpload = multer();
const checkToken = require('../middleware/checkToken');

router.get('/', controller.GET);
router.get('/:videoId', controller.GET);

router.post('/', checkToken, videoUpload.single('video'), controller.POST);
router.put('/', checkToken, controller.PUT);
router.delete('/', checkToken, controller.DELETE);

module.exports = router;
