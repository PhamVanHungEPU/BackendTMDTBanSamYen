// backend/routes/webhook.js
const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const router = express.Router();

const secret = process.env.WEBHOOK_SECRET;

router.post('/webhook', (req, res) => {
     console.log('📥 Webhook received:', new Date().toISOString());

  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  if (signature !== digest) {
    console.log('Webhook signature mismatch');
    return res.status(401).send('Unauthorized');
  }

  if (req.body.ref === 'refs/heads/main') {
    exec('cd /app/BackendThiTracNghiem && git pull && pm2 restart all', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing git pull: ${stderr}`);
        return res.status(500).send('Failed to update application');
      }
      console.log(`Git pull output: ${stdout}`);
      res.send('Application updated and restarted');
    });
  } else {
    res.send('No changes to main branch');
  }
});

module.exports = router;
