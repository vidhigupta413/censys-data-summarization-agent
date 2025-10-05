// Configuration
const API_BASE_URL = 'http://localhost:5001';

// DOM elements
const analyzeForm = document.getElementById('analyzeForm');
const ipInput = document.getElementById('ipInput');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const analyzedIp = document.getElementById('analyzedIp');
const summaryContent = document.getElementById('summaryContent');
const errorMessage = document.getElementById('errorMessage');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const retryBtn = document.getElementById('retryBtn');
const ipTags = document.querySelectorAll('.ip-tag');

// State management
let currentAnalysis = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Form submission
    analyzeForm.addEventListener('submit', handleFormSubmit);
    
    // Sample IP tags
    ipTags.forEach(tag => {
        tag.addEventListener('click', () => {
            ipInput.value = tag.dataset.ip;
            handleFormSubmit(new Event('submit'));
        });
    });
    
    // Action buttons
    newAnalysisBtn.addEventListener('click', resetForm);
    copySummaryBtn.addEventListener('click', copySummary);
    retryBtn.addEventListener('click', retryAnalysis);
    
    // Input validation
    ipInput.addEventListener('input', validateIpInput);
}

function validateIpInput(event) {
    const ip = event.target.value.trim();
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (ip && !ipRegex.test(ip)) {
        ipInput.style.borderColor = '#dc3545';
    } else {
        ipInput.style.borderColor = '#e1e5e9';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const ip = ipInput.value.trim();
    
    if (!ip) {
        showError('Please enter an IP address');
        return;
    }
    
    if (!isValidIp(ip)) {
        showError('Please enter a valid IP address');
        return;
    }
    
    await analyzeHost(ip);
}

function isValidIp(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

async function analyzeHost(ip) {
    showLoading();
    hideError();
    hideResults();
    
    try {
        const response = await fetch(`${API_BASE_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ip })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        currentAnalysis = data;
        showResults(data);
        
    } catch (error) {
        console.error('Analysis failed:', error);
        showError(error.message || 'Failed to analyze host. Please check your connection and try again.');
    }
}

function showLoading() {
    hideError();
    hideResults();
    loadingSection.classList.remove('hidden');
    
    // Add some animation to the loading text
    const loadingText = loadingSection.querySelector('p');
    let dots = 0;
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.textContent = `Analyzing host data with AI${'.'.repeat(dots)}`;
    }, 500);
    
    // Store interval ID for cleanup
    loadingSection.dataset.intervalId = interval;
}

function hideLoading() {
    loadingSection.classList.add('hidden');
    
    // Clear the animation interval
    const intervalId = loadingSection.dataset.intervalId;
    if (intervalId) {
        clearInterval(intervalId);
        delete loadingSection.dataset.intervalId;
    }
}

function showResults(data) {
    hideLoading();
    hideError();
    
    analyzedIp.textContent = data.ip;
    
    // Format the summary content to handle markdown-style formatting
    const { bulletPointsHtml, paragraphHtml } = formatSummaryContent(data.summary);
    summaryContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                ${bulletPointsHtml}
            </div>
            <div class="md:w-1/2">
                ${paragraphHtml}
            </div>
        </div>
    `;
    
    resultsSection.classList.remove('hidden');
    
    // Smooth scroll to results
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Add a subtle animation
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        resultsSection.style.transition = 'all 0.5s ease';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    });
}

function formatSummaryContent(summary) {
    let bulletPointsHtml = '';
    let paragraphHtml = '';

    // Extract Bullet Point Summary section
    const bulletPointsMatch = summary.match(/## Bullet Point Summary\n([\s\S]*?)(?=## Paragraph Summary|$)/);
    if (bulletPointsMatch && bulletPointsMatch[1]) {
        let rawBulletPoints = bulletPointsMatch[1].trim();
        bulletPointsHtml = rawBulletPoints
            .replace(/^- (.+)$/gm, '<li class="mb-3 leading-relaxed text-lg">$1</li>')
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-blue-700">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic text-blue-600">$1</em>');
        
        // Make bullet point categories bold and bigger (text before colon)
        bulletPointsHtml = bulletPointsHtml.replace(/(<li class="mb-3 leading-relaxed text-lg">)([^:]+):/g, '$1<strong class="font-bold text-gray-900 text-xl">$2:</strong>');
        
        // Make important words bold
        const importantWords = [
            'vulnerabilities', 'vulnerability', 'CVE', 'security', 'threat', 'malware', 'risk', 'critical', 'high', 'medium', 'low',
            'attack', 'exploit', 'breach', 'compromise', 'infected', 'suspicious', 'malicious', 'dangerous', 'exposed', 'unprotected',
            'outdated', 'deprecated', 'unpatched', 'recommend', 'immediate', 'urgent', 'priority', 'patch', 'update', 'fix'
        ];
        
        importantWords.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            bulletPointsHtml = bulletPointsHtml.replace(regex, '<strong class="font-bold text-gray-900">$1</strong>');
        });
        
        bulletPointsHtml = bulletPointsHtml.replace(/(<li class="mb-2 leading-relaxed">.*<\/li>)(?:\s*<li class="mb-2 leading-relaxed">.*<\/li>)*/g, (match) => {
            return '<ul class="list-disc list-inside space-y-1 my-4">' + match + '</ul>';
        });
        bulletPointsHtml = `<h3 class="text-xl font-bold text-blue-600 mb-3">Bullet Point Summary</h3>` + bulletPointsHtml;
    }

    // Extract Paragraph Summary section
    const paragraphMatch = summary.match(/## Paragraph Summary\n([\s\S]*)/);
    if (paragraphMatch && paragraphMatch[1]) {
        let rawParagraph = paragraphMatch[1].trim();
        paragraphHtml = rawParagraph
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-blue-700">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic text-blue-600">$1</em>');
        
        // Make important words bold
        const importantWords = [
            'vulnerabilities', 'vulnerability', 'CVE', 'security', 'threat', 'malware', 'risk', 'critical', 'high', 'medium', 'low',
            'attack', 'exploit', 'breach', 'compromise', 'infected', 'suspicious', 'malicious', 'dangerous', 'exposed', 'unprotected',
            'outdated', 'deprecated', 'unpatched', 'recommend', 'immediate', 'urgent', 'priority', 'patch', 'update', 'fix'
        ];
        
        importantWords.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            paragraphHtml = paragraphHtml.replace(regex, '<strong class="font-bold text-gray-900">$1</strong>');
        });
        
        paragraphHtml = paragraphHtml.replace(/\n\n/g, '<br><br>');
        paragraphHtml = `<h3 class="text-xl font-bold text-blue-600 mb-3">Paragraph Summary</h3><p class="text-gray-700 leading-loose text-lg">${paragraphHtml}</p>`;
    }

    return { bulletPointsHtml, paragraphHtml };
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    hideResults();
    
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    
    // Smooth scroll to error
    errorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function hideError() {
    errorSection.classList.add('hidden');
}

function resetForm() {
    ipInput.value = '';
    hideResults();
    hideError();
    hideLoading();
    
    // Focus back on input
    ipInput.focus();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function retryAnalysis() {
    if (ipInput.value.trim()) {
        handleFormSubmit(new Event('submit'));
    } else {
        resetForm();
    }
}

async function copySummary() {
    if (!currentAnalysis || !currentAnalysis.summary) {
        return;
    }
    
    try {
        await navigator.clipboard.writeText(currentAnalysis.summary);
        
        // Show success feedback
        const originalText = copySummaryBtn.innerHTML;
        copySummaryBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copySummaryBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copySummaryBtn.innerHTML = originalText;
            copySummaryBtn.style.background = '';
        }, 2000);
        
    } catch (error) {
        console.error('Failed to copy:', error);
        
        // Fallback: show the text in a prompt
        prompt('Copy this summary:', currentAnalysis.summary);
    }
}

// Add some keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to reset form
    if (event.key === 'Escape') {
        resetForm();
    }
    
    // Enter key in input field (handled by form submit)
    if (event.key === 'Enter' && event.target === ipInput) {
        event.preventDefault();
        handleFormSubmit(event);
    }
});

// Add connection status indicator
function checkBackendConnection() {
    fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: '127.0.0.1' }) // Test IP
    })
    .then(response => {
        // Even if it fails, we know the backend is reachable
        console.log('Backend connection: OK');
    })
    .catch(error => {
        console.warn('Backend connection issue:', error);
        // You could show a warning banner here if needed
    });
}

// Check backend connection on page load
window.addEventListener('load', checkBackendConnection);
