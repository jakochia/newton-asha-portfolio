require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mount the same handlers used by Vercel
const contactHandler = require('./api/contact');
const testHandler = require('./api/test');

app.get('/api/test', (req, res) => testHandler(req, res));
app.post('/api/contact', (req, res) => contactHandler(req, res));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email configured for: ${process.env.GMAIL_USER || 'NOT SET'}`);
});