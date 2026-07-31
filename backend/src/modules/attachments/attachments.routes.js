const { Router } = require('express');

const controller = require('./attachments.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/:id/download', controller.download);
router.delete('/:id', controller.remove);

module.exports = router;
