const nodemailer = require('nodemailer');
let transporter = null;
function getTransporter() {
    if (transporter) return transporter;
    const user = process.env.GMAIL_USER;
    const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');
    if (!user || !pass) { console.error('Missing credentials'); return null; }
    transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    return transporter;
}
function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function buildEmailHTML(name, email, message) {
    const timestamp = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' });
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<table role="presentation" width="100%" style="background:#f1f5f9;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
<tr><td style="background:#0f172a;padding:28px 32px;">
<p style="margin:0;color:#fff;font-size:18px;font-weight:700;">Newton Asha</p>
<p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">ICT Support · Networking · Software Engineering</p>
</td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 24px;color:#0f172a;font-size:15px;">You received a new message from your portfolio contact form.</p>
<table width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px;">
<p style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;font-weight:600;">From</p>
<p style="margin:0 0 12px;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(name)}</p>
<p style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;font-weight:600;">Email</p>
<p style="margin:0;"><a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a></p>
</td></tr></table>
<p style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;font-weight:600;">Message</p>
<div style="background:#f8fafc;border-left:3px solid #2563eb;border-radius:8px;padding:20px;margin-bottom:28px;">
<p style="margin:0;color:#1e293b;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p></div>
<p style="text-align:center;"><a href="mailto:${escapeHtml(email)}?subject=Re: Your portfolio message" style="display:inline-block;background:#0f172a;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px;">Reply to ${escapeHtml(name)}</a></p>
</td></tr>
<tr><td style="padding:24px 32px 32px;">
<p style="margin:0 0 6px;color:#64748b;font-size:12px;">Sent from <a href="https://jakochia.co.ke" style="color:#2563eb;">jakochia.co.ke</a></p>
<p style="margin:0;color:#94a3b8;font-size:11px;">${timestamp} EAT</p>
</td></tr></table></td></tr></table></body></html>`;
}
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    if (!body || typeof body !== 'object') body = {};
    const { name, email, message } = body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'All fields required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Invalid email' });
    const mailer = getTransporter();
    if (!mailer) return res.status(500).json({ success: false, message: 'Email not configured' });
    const safeName = String(name).slice(0, 200);
    const safeEmail = String(email).slice(0, 200);
    const safeMessage = String(message).slice(0, 5000);
    try {
        await mailer.sendMail({
            from: `"Newton Asha Portfolio" <${process.env.GMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER,
            replyTo: `"${safeName}" <${safeEmail}>`,
            subject: `New portfolio message from ${safeName}`,
            html: buildEmailHTML(safeName, safeEmail, safeMessage)
        });
        console.log(`Email sent from ${safeName}`);
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Email error:', error.message || error);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};
