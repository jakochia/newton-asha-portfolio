module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    const emailConfigured = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    return res.status(200).json({
        success: true,
        emailEnabled: emailConfigured,
        message: emailConfigured ? 'Server running, email configured' : 'Server running, email NOT configured',
        environment: process.env.VERCEL_ENV || 'local',
        timestamp: new Date().toISOString()
    });
};
