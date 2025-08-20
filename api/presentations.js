require('dotenv').config({ path: '../../.env' });

// Default presentation URL if not set in environment variables
const DEFAULT_PRESENTATION_URL = 'https://docs.google.com/presentation/d/1FaQA7n7TihTBHE3ge_MFC9lJ7nFBuDeR6Al4ZVeqcF4/edit?usp=sharing';

function toSlidesPreview(url) {
    try {
        const u = new URL(url);
        // Convert /edit or other variants to /preview for better display
        u.pathname = u.pathname.replace(/\/edit.*$/, '/preview');
        return u.toString();
    } catch {
        return url;
    }
}

module.exports = (req, res) => {
    const presentationUrl = process.env.PRESENTATION_URL || DEFAULT_PRESENTATION_URL;
    
    if (presentationUrl) {
        return res.redirect(302, toSlidesPreview(presentationUrl));
    }
    
    // If no presentation URL is configured
    return res.status(404).json({ error: 'Presentation not configured' });
};

// For local development
if (require.main === module) {
    const { createServer } = require('http');
    const server = createServer((req, res) => {
        module.exports(req, res);
    });
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
