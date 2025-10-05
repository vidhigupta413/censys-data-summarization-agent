import React, { useState } from 'react';

const SearchForm = ({ onAnalyzeIp }) => {
  const [ip, setIp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Example IP addresses from hosts_dataset.json
  const exampleIPs = [
    { ip: '168.196.241.227', label: 'Host 1' },
    { ip: '1.92.135.168', label: 'Host 2' },
    { ip: '1.94.62.205', label: 'Host 3' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ip.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAnalyzeIp(ip.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setIp(e.target.value);
  };

  const handleExampleClick = async (exampleIp) => {
    setIp(exampleIp);
    setIsSubmitting(true);
    try {
      await onAnalyzeIp(exampleIp);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <i className="fas fa-globe search-icon"></i>
          <input
            type="text"
            value={ip}
            onChange={handleInputChange}
            placeholder="Enter IP address (e.g., 168.196.241.227)"
            required
            className="search-input"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="search-button"
          disabled={isSubmitting || !ip.trim()}
        >
          {isSubmitting ? 'Analyzing...' : 'Analyze Host'}
        </button>
      </form>
      
      {/* Example IP Buttons */}
      <div className="example-buttons-container">
        <p className="example-label">Try these examples:</p>
        <div className="example-buttons">
          {exampleIPs.map((example, index) => (
            <button
              key={index}
              type="button"
              className="example-button"
              onClick={() => handleExampleClick(example.ip)}
              disabled={isSubmitting}
              title={`Click to analyze ${example.ip}`}
            >
              <span className="example-button-label">{example.label}</span>
              <span className="example-button-ip">{example.ip}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
