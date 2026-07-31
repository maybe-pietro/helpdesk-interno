const { Router } = require('express');
const { body } = require('express-validator');

const controller = require('./users.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/roles.middleware');
const validate = require('../../middleware/validate.middleware');

const router = Router();

router.use(authMiddleware);

// Agents also need to read the user list (e.g. to see who to assign a ticket
// to), so GET is open to agente/admin; writes remain admin-only.
router.get('/', requireRole('agente', 'admin'), controller.list);
router.get('/:id', requireRole('agente', 'admin'), controller.getById);

router.post(
  '/',
  requireRole('admin'),
  [
    body('name').isString().trim().notEmpty(),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 8 }),
    body('role').isIn(['solicitante', 'agente', 'admin']),
    body('department_id').optional({ nullable: true }).isInt(),
  ],
  validate,
  controller.create,
);

router.patch(
  '/:id',
  requireRole('admin'),
  [
    body('name').optional().isString().trim().notEmpty(),
    body('role').optional().isIn(['solicitante', 'agente', 'admin']),
    body('department_id').optional({ nullable: true }).isInt(),
    body('is_active').optional().isBoolean(),
  ],
  validate,
  controller.update,
);

router.delete('/:id', requireRole('admin'), controller.remove);

module.exports = router;
