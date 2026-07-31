const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(env.uploads.dir, 'tickets', String(req.params.id));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${uuidv4()}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.uploads.maxUploadMb * 1024 * 1024 },
});

module.exports = upload;
