# Censys Data Summarization Agent

A full-stack AI-powered web application that analyzes and summarizes Censys host security data. The application uses OpenAI's GPT model to generate structured security analysis reports with bullet point summaries and detailed paragraph descriptions.

## 🌟 Features

- **AI-Powered Analysis**: Uses OpenAI GPT-3.5-turbo for intelligent security analysis
- **Interactive UI**: Modern React.js frontend with advanced animations
- **Real-time Processing**: Fast analysis of host data with loading states
- **Visual Effects**: Electric borders, magnet lines, decrypted text animations, and shiny headers
- **Responsive Design**: Optimized for desktop and mobile devices
- **Example Data**: Pre-loaded example IP addresses for quick testing

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ 
- Node.js 16+ and npm
- OpenAI API key

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vidhigupta413/censys-data-summarization-agent.git
   cd censys-data-summarization-agent
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in backend directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > backend/.env
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

**Option 1: Using the start script (Recommended)**
```bash
# From project root
chmod +x start-app.sh
./start-app.sh
```

**Option 2: Manual start**
```bash
# Terminal 1 - Start backend
cd backend
python3 app.py

# Terminal 2 - Start frontend  
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 📖 How to Use

1. **Enter IP Address**: Type an IP address in the search field
2. **Use Examples**: Click on example IP buttons for quick testing
3. **View Results**: Analyze the generated security summary with:
   - Bullet point breakdown of key security metrics
   - Detailed paragraph analysis
4. **Interactive Elements**: Enjoy the animated UI effects while browsing results

## 🧪 Testing

### Manual Testing

1. **Start the application** using the instructions above
2. **Test with example IPs**:
   - Click the example IP buttons (Host 1, Host 2, Host 3)
   - Verify bullet points display correctly
   - Check paragraph summary animation
3. **Test with custom IPs**:
   - Enter IP addresses from the dataset
   - Try invalid IP formats (should show validation errors)
4. **Test error handling**:
   - Enter non-existent IP addresses
   - Test with empty input fields

### Automated Testing

```bash
# Backend API testing
cd backend
python3 -c "
import requests
response = requests.post('http://localhost:5001/summarize', 
                        json={'ip': '168.196.241.227'})
print(response.json())
"

# Frontend testing (if Jest is configured)
cd frontend
npm test
```

### Health Check

```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "healthy", 
  "service": "censys-analysis-agent"
}
```

## 🤖 AI Techniques & Implementation

### Core AI Architecture

**Model**: OpenAI GPT-3.5-turbo
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 500 (optimized for concise summaries)
- **Prompt Engineering**: Structured prompts with strict formatting rules

### AI Prompt Engineering

The application uses sophisticated prompt engineering techniques:

1. **Structured Templates**: Pre-defined format templates ensure consistent output
2. **Format Enforcement**: Strict rules prevent AI from deviating from required structure
3. **Context Injection**: Host data is injected as JSON context for accurate analysis
4. **Post-processing**: Regex-based cleanup ensures proper formatting

### Example Prompt Structure
```
Create a security analysis summary. Use EXACTLY this format for every host:

## Bullet Point Summary
- IP: [IP address]
- Location: [City, Country]
- Autonomous System: [ASN, Provider]
- Services: [All ports and protocols]
- Vulnerabilities: [All CVEs with severities]
- Threat Intelligence: [Risk level and labels]

## Paragraph Summary
[5-7 sentence security analysis]
```

### AI Processing Pipeline

1. **Data Validation**: Input IP validation and dataset lookup
2. **Context Preparation**: Format host data as structured JSON
3. **AI Generation**: Send formatted prompt to OpenAI API
4. **Response Processing**: Clean and format AI output
5. **Error Handling**: Graceful fallbacks for API failures

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with CORS support
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Comprehensive error management
- **Data Processing**: Regex-based text formatting and cleanup

### Frontend (React.js)
- **Framework**: React 18 with functional components
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Styling**: CSS3 with custom properties and animations
- **Components**: Modular component architecture

### Key Components
- **SearchForm**: IP input with validation and example buttons
- **Results**: Displays AI-generated analysis with animations
- **ElectricBorder**: Animated glowing border component
- **MagnetLines**: Interactive background grid effect
- **DecryptedText**: Typewriter-style text animation
- **ShinyText**: Metallic shine effect for headers

## 📁 Project Structure

```
censys-data-summarization-agent/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── hosts_dataset.json     # Sample host data
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── styles/           # CSS stylesheets
│   │   ├── App.js            # Main React app
│   │   └── index.js          # React entry point
│   ├── package.json          # Node.js dependencies
│   └── package-lock.json     # Dependency lock file
├── start-app.sh              # Application start script
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔧 Development Assumptions

### Technical Assumptions
1. **OpenAI API Access**: Valid API key with sufficient credits
2. **Network Connectivity**: Stable internet connection for API calls
3. **Browser Compatibility**: Modern browsers supporting ES6+ and CSS3
4. **Python Environment**: Python 3.8+ with pip package manager
5. **Node.js Environment**: Node.js 16+ with npm package manager

### Data Assumptions
1. **Host Dataset**: Valid JSON structure with 'hosts' array containing IP addresses
2. **IP Format**: IPv4 addresses in standard dotted decimal notation
3. **Data Completeness**: Host data includes location, services, vulnerabilities, and threat intelligence
4. **API Response**: OpenAI API returns well-formed JSON responses

### User Experience Assumptions
1. **Desktop Primary**: Application optimized for desktop use, responsive for mobile
2. **Security Focus**: Users are primarily interested in security analysis
3. **Quick Analysis**: Users want fast, concise security summaries
4. **Visual Appeal**: Users appreciate animated, modern UI elements

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check Python version (3.8+ required)
- Verify OpenAI API key in `.env` file
- Ensure all dependencies installed: `pip install -r requirements.txt`

**Frontend not loading:**
- Check Node.js version (16+ required)
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**API errors:**
- Verify backend is running on port 5001
- Check OpenAI API key validity and credits
- Review browser console for CORS errors

**Animation issues:**
- Ensure modern browser with CSS3 support
- Check for JavaScript errors in browser console
- Verify all component files are present

## 📝 API Documentation

### Endpoints

**POST /summarize**
- **Description**: Generate security analysis for an IP address
- **Request Body**: `{"ip": "192.168.1.1"}`
- **Response**: 
  ```json
  {
    "ip": "192.168.1.1",
    "summary": "## Bullet Point Summary\n- IP: 192.168.1.1\n..."
  }
  ```

**GET /health**
- **Description**: Health check endpoint
- **Response**: 
  ```json
  {
    "status": "healthy",
    "service": "censys-analysis-agent"
  }
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m "Add feature"`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is developed as part of a summer internship take-home project. Please refer to the specific licensing terms provided by your organization.

## 🔗 Links

- **Repository**: https://github.com/vidhigupta413/censys-data-summarization-agent
- **OpenAI API**: https://platform.openai.com/docs
- **React Documentation**: https://reactjs.org/docs
- **Flask Documentation**: https://flask.palletsprojects.com/

---

**Built with ❤️ using React.js, Flask, and OpenAI GPT-3.5-turbo**