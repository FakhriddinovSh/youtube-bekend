const router = require('express').Router();
const controller = require('../controllers/authController');

router.post('/register', controller.REGISTER);
router.post('/login', controller.LOGIN);

module.exports = router;
