const router = require('express').Router();
const controller = require('../controllers/userController');

router.get('/', controller.GET);
router.get('/:userId', controller.GET);

module.exports = router;
