import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import LoadingSpinner from './components/LoadingSpinner';
import Results from './components/Results';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import MagnetLines from './components/MagnetLines';
import ElectricBorder from './components/ElectricBorder';

function App() {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [analyzedIp, setAnalyzedIp] = useState('');

  // Function to handle IP analysis
  const handleAnalyzeIp = async (ip) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('http://127.0.0.1:5001/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setAnalyzedIp(ip);
    } catch (err) {
      console.error('Error analyzing IP:', err);
      setError(`Failed to analyze IP address: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to scroll to results smoothly
  const scrollToResults = () => {
    const resultsElement = document.getElementById('results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <Header />

        {/* Search Form */}
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <div className="card">
            <SearchForm onAnalyzeIp={handleAnalyzeIp} />
          </div>
        </ElectricBorder>

        {/* Loading Spinner */}
        {loading && (
          <LoadingSpinner />
        )}

        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} />
        )}

        {/* Results */}
        {results && (
          <Results 
            data={results} 
            ip={analyzedIp}
            onMount={scrollToResults}
          />
        )}

        {/* Footer */}
        <Footer />
      </div>
      
      {/* Magnet Lines - Left Column */}
      <MagnetLines
        rows={9}
        columns={4}
        lineColor="#ffeeaa"
        lineWidth="0.8vmin"
        lineHeight="5vmin"
        baseAngle={0}
        style={{ 
          position: "fixed",
          top: "50%",
          left: "10%",
          transform: "translate(-50%, -50%)",
          width: "10vmin",
          height: "100vh"
        }}
      />
      
      {/* Magnet Lines - Right Column */}
      <MagnetLines
        rows={9}
        columns={4}
        lineColor="#ffeeaa"
        lineWidth="0.8vmin"
        lineHeight="5vmin"
        baseAngle={0}
        style={{ 
          position: "fixed",
          top: "50%",
          right: "10%",
          transform: "translate(50%, -50%)",
          width: "10vmin",
          height: "100vh"
        }}
      />
    </div>
  );
}

export default App;
