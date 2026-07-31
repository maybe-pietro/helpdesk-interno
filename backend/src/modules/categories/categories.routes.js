const { Router } = require('express');
const { body } = require('express-validator');

const controller = require('./categories.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/roles.middleware');
const validate = require('../../middleware/validate.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', controller.list);

router.post(
  '/',
  requireRole('admin'),
  [
    body('name').isString().trim().notEmpty(),
    body('department_id').isInt(),
  ],
  validate,
  controller.create,
);

router.patch(
  '/:id',
  requireRole('admin'),
  [body('name').optional().isString().trim().notEmpty()],
  validate,
  controller.update,
);

router.delete('/:id', requireRole('admin'), controller.remove);

module.exports = router;
