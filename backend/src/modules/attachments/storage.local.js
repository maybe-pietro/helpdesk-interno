const fs = require('fs');
const path = require('path');
const env = require('../../config/env');

// Small storage interface so the disk-based implementation can be swapped
// for S3/MinIO later without touching controllers or services.

function resolvePath(ticketId, storedFilename) {
  return path.join(env.uploads.dir, 'tickets', String(ticketId), storedFilename);
}

function getFileStream(ticketId, storedFilename) {
  return fs.createReadStream(resolvePath(ticketId, storedFilename));
}

function deleteFile(ticketId, storedFilename) {
  const filePath = resolvePath(ticketId, storedFilename);
  return fs.promises.unlink(filePath).catch((err) => {
    if (err.code !== 'ENOENT') throw err;
  });
}

module.exports = { getFileStream, deleteFile };
