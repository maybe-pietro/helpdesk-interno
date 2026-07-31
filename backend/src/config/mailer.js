const nodemailer = require('nodemailer');
const env = require('./env');

function createTransport() {
  if (!env.smtp.enabled) {
    return {
      sendMail: async (options) => {
        console.log('[mailer] notifications disabled, would have sent:', {
          to: options.to,
          subject: options.subject,
        });
        return { accepted: [], rejected: [], skipped: true };
      },
    };
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
}

module.exports = createTransport();
