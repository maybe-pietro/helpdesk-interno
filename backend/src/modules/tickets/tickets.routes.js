const { Router } = require('express');
const { body } = require('express-validator');

const controller = require('./tickets.controller');
const commentsController = require('../comments/comments.controller');
const attachmentsController = require('../attachments/attachments.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');
const validate = require('../../middleware/validate.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', controller.list);

router.post(
  '/',
  [
    body('title').isString().trim().notEmpty(),
    body('description').isString().trim().notEmpty(),
    body('category_id').isInt(),
    body('priority').optional().isIn(['baixa', 'media', 'alta', 'urgente']),
    body('requester_id').optional().isInt(),
  ],
  validate,
  controller.create,
);

router.get('/:id', controller.getById);

router.patch(
  '/:id',
  [
    body('title').optional().isString().trim().notEmpty(),
    body('description').optional().isString().trim().notEmpty(),
    body('category_id').optional().isInt(),
    body('priority').optional().isIn(['baixa', 'media', 'alta', 'urgente']),
  ],
  validate,
  controller.update,
);

router.patch(
  '/:id/status',
  [body('status').isIn(['aberto', 'em_andamento', 'aguardando_solicitante', 'resolvido', 'fechado'])],
  validate,
  controller.changeStatus,
);

router.patch(
  '/:id/assign',
  [body('agent_id').isInt()],
  validate,
  controller.assign,
);

router.get('/:id/events', commentsController.listEvents);

router.post(
  '/:id/comments',
  [body('body').isString().trim().notEmpty(), body('is_internal').optional().isBoolean()],
  validate,
  commentsController.addComment,
);

router.post('/:id/attachments', upload.single('file'), attachmentsController.upload);

module.exports = router;
