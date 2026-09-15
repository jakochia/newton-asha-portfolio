require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ───────── Email transporter ─────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '')
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('❌ Email transporter error:', error.message);
    } else {
        console.log('✅ Email server ready to send messages');
    }
});

// ───────── Test endpoint ─────────
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        emailEnabled: true,
        message: 'Server is running and email is configured'
    });
});

// ───────── Contact endpoint ─────────
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    const mailOptions = {
        from: `"Newton Asha Portfolio" <${process.env.GMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: `"${name}" <${email}>`,
        subject: `New portfolio message from ${name}`,
        html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(15,23,42,0.06);">

          <tr>
            <td style="background:#0f172a; padding:28px 32px;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <p style="margin:0; color:#ffffff; font-size:18px; font-weight:700; letter-spacing:-0.2px;">Newton Asha</p>
                    <p style="margin:4px 0 0; color:#94a3b8; font-size:12px;">ICT Support · Networking · Software Engineering</p>
                  </td>
                  <td align="right">
                    <span style="display:inline-block; background:#1e293b; color:#93c5fd; font-size:11px; font-weight:600; padding:6px 12px; border-radius:999px;">NEW MESSAGE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">

              <p style="margin:0 0 24px; color:#0f172a; font-size:15px; line-height:1.5;">
                You received a new message from your portfolio contact form.
              </p>

              <table role="presentation" width="100%" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td width="80" valign="top" style="padding-bottom:12px;">
                          <p style="margin:0; color:#64748b; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">From</p>
                        </td>
                        <td valign="top" style="padding-bottom:12px;">
                          <p style="margin:0; color:#0f172a; font-size:14px; font-weight:600;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="80" valign="top">
                          <p style="margin:0; color:#64748b; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Email</p>
                        </td>
                        <td valign="top">
                          <a href="mailto:${email}" style="color:#2563eb; font-size:14px; text-decoration:none; font-weight:500;">${email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px; color:#64748b; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Message</p>
              <div style="background:#f8fafc; border-left:3px solid #2563eb; border-radius:8px; padding:20px; margin-bottom:28px;">
                <p style="margin:0; color:#1e293b; font-size:14px; line-height:1.7; white-space:pre-wrap;">${message}</p>
              </div>

              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: Your portfolio message"
                       style="display:inline-block; background:#0f172a; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; padding:14px 28px; border-radius:10px;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px; background:#e2e8f0;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 32px;">
              <p style="margin:0 0 6px; color:#64748b; font-size:12px; line-height:1.6;">
                This message was sent from the contact form at
                <a href="https://newton-asha-portfolio.vercel.app" style="color:#2563eb; text-decoration:none;">newton-asha-portfolio.vercel.app</a>
              </p>
              <p style="margin:0; color:#94a3b8; font-size:11px;">
                ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' })} EAT
              </p>
            </td>
          </tr>

        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin-top:16px;">
          <tr>
            <td align="center">
              <p style="margin:0; color:#94a3b8; font-size:11px;">
                Newton Asha · Nairobi, Kenya · <a href="https://blog.jakochia.co.ke" style="color:#94a3b8; text-decoration:none;">blog.jakochia.co.ke</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📨 Email sent from ${name} <${email}>`);
        res.json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.'
        });
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// ───────── Serve main page ─────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email configured for: ${process.env.GMAIL_USER}`);
});