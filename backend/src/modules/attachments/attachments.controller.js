const attachmentsService = require('./attachments.service');

async function upload(req, res, next) {
  try {
    const attachment = await attachmentsService.addAttachment(req.user, Number(req.params.id), req.file);
    res.status(201).json(attachment);
  } catch (err) {
    next(err);
  }
}

async function download(req, res, next) {
  try {
    const { attachment, stream } = await attachmentsService.getForDownload(req.user, Number(req.params.id));
    res.setHeader('Content-Type', attachment.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.original_name}"`);
    stream.on('error', next);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await attachmentsService.remove(req.user, Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, download, remove };
