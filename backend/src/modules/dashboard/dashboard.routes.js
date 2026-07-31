const { Router } = require('express');

const controller = require('./dashboard.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/roles.middleware');

const router = Router();

router.use(authMiddleware, requireRole('agente', 'admin'));

router.get('/summary', controller.summary);
router.get('/by-category', controller.byCategory);
router.get('/by-department', controller.byDepartment);
router.get('/avg-resolution-time', controller.avgResolutionTime);

module.exports = router;
