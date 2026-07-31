const dashboardService = require('./dashboard.service');

async function summary(req, res, next) {
  try {
    res.json(await dashboardService.summary());
  } catch (err) {
    next(err);
  }
}

async function byCategory(req, res, next) {
  try {
    res.json(await dashboardService.byCategory());
  } catch (err) {
    next(err);
  }
}

async function byDepartment(req, res, next) {
  try {
    res.json(await dashboardService.byDepartment());
  } catch (err) {
    next(err);
  }
}

async function avgResolutionTime(req, res, next) {
  try {
    const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
    res.json(await dashboardService.avgResolutionTime({ departmentId }));
  } catch (err) {
    next(err);
  }
}

module.exports = { summary, byCategory, byDepartment, avgResolutionTime };
