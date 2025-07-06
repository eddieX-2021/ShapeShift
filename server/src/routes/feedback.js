// routes/feedback.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // again, only if you really need to skip cert checks:
  tls: {
    rejectUnauthorized: false
  }
});

// 2) helper fn
async function sendFeedbackEmail(message) {
  return transporter.sendMail({
    from:    process.env.SMTP_USER,
    to:      process.env.FEEDBACK_DEST,
    subject: 'Feedback',
    html:    `<p>${message.replace(/\n/g,'<br>')}</p>`,
  });
}

// 3) POST /api/feedback
router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing `message` in request body.' });
  }

  try {
    const info = await sendFeedbackEmail(message);
    console.log('✉️  Feedback sent, id:', info.messageId);

    // if you’re testing with Ethereal, you can also log preview URL:
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌  Error sending feedback:', err);
    res.status(500).json({ error: 'Failed to send feedback email.' });
  }
});

module.exports = router;
