import React, { useState, useEffect } from 'react';

const DecryptedText = ({ text, speed = 50, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Characters to use for the "decryption" effect
  const decryptionChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    if (!text) return;

    // Initial delay before starting animation
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= text.length) {
            clearInterval(interval);
            setIsComplete(true);
            return prevIndex;
          }

          // Show decryption characters for the current position
          const randomChar = decryptionChars[Math.floor(Math.random() * decryptionChars.length)];
          
          setDisplayedText(prev => {
            // Build the text up to current position with real characters
            let newText = text.substring(0, prevIndex + 1);
            // Only add random character if we haven't reached the end
            if (prevIndex + 1 < text.length) {
              newText += randomChar;
            }
            return newText;
          });

          return prevIndex + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [text, speed, delay, decryptionChars]);

  // Function to format text with bold important words
  const formatTextWithBold = (text) => {
    const importantWords = [
      'vulnerabilities', 'vulnerability', 'CVE', 'security', 'threat', 'malware', 'risk', 
      'critical', 'high', 'medium', 'low', 'attack', 'exploit', 'breach', 'compromise', 
      'infected', 'suspicious', 'malicious', 'dangerous', 'exposed', 'unprotected',
      'outdated', 'deprecated', 'unpatched', 'recommend', 'immediate', 'urgent', 
      'priority', 'patch', 'update', 'fix'
    ];

    let formattedText = text;

    // Replace line breaks with <br> tags
    formattedText = formattedText.replace(/\n\n/g, '<br><br>');

    // Make important words bold
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      formattedText = formattedText.replace(regex, '<strong class="paragraph-strong">$1</strong>');
    });

    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <div className={`decrypted-text-container ${isComplete ? 'complete' : ''}`}>
      {formatTextWithBold(displayedText)}
    </div>
  );
};

export default DecryptedText;
