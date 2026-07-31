const commentsService = require('./comments.service');

async function listEvents(req, res, next) {
  try {
    res.json(await commentsService.listEvents(req.user, Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const { body, is_internal: isInternal } = req.body;
    const event = await commentsService.addComment(req.user, Number(req.params.id), body, isInternal);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

module.exports = { listEvents, addComment };
