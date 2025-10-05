# Frontend - Censys Data Summarization Agent

A modern, responsive web interface for the Censys Data Summarization Agent.

## Features

- 🎨 **Beautiful UI**: Modern gradient design with glassmorphism effects
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast**: Optimized for performance with smooth animations
- 🔍 **Easy to use**: Click sample IPs or enter your own
- 📋 **Copy functionality**: One-click copy of AI summaries
- ⌨️ **Keyboard shortcuts**: Enter to submit, Escape to reset

## How to Use

1. **Make sure your backend is running** on `http://localhost:5001`
2. **Open the frontend** by opening `index.html` in your browser
3. **Enter an IP address** or click one of the sample IPs
4. **Click Analyze** to get an AI-generated security summary
5. **Copy the summary** or start a new analysis

## Sample IP Addresses

- `168.196.241.227` - New York, US
- `1.92.135.168` - Beijing, China  
- `1.94.62.205` - Shanghai, China

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox/Grid
- **Vanilla JavaScript**: No frameworks, pure performance
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Inter font family

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

The frontend is designed to be easily customizable:

- **Colors**: Modify CSS custom properties in `styles.css`
- **API URL**: Change `API_BASE_URL` in `script.js`
- **Content**: Update text in `index.html`
- **Styling**: All styles are in `styles.css` with clear organization

## Troubleshooting

**Frontend not connecting to backend?**
- Make sure backend is running on port 5001
- Check browser console for CORS errors
- Verify API_BASE_URL in script.js

**Styling issues?**
- Clear browser cache
- Check that all CSS files are loading
- Verify font imports are working

**JavaScript errors?**
- Open browser developer tools
- Check console for error messages
- Ensure all dependencies are loaded
