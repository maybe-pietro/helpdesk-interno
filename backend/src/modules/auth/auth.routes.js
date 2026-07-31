const { Router } = require('express');
const { body } = require('express-validator');

const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');

const router = Router();

router.post(
  '/login',
  [body('email').isEmail(), body('password').isString().notEmpty()],
  validate,
  authController.login,
);

router.get('/me', authMiddleware, authController.me);

router.post(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 8 }),
  ],
  validate,
  authController.changePassword,
);

module.exports = router;
