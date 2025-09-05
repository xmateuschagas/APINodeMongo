const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/tokenValidator.js');
const validate = require('../middlewares/dataValidator.js');
const { loginSchema } = require('../schemas/authSchema.js');

router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.post('/refresh', authController.refresh);

module.exports = router;