import React, { useEffect, useState } from 'react';
import DecryptedText from './DecryptedText';
import ShinyText from './ShinyText';
import ScrambledText from './ScrambledText';

const Results = ({ data, ip, onMount }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);

  useEffect(() => {
    // Trigger scroll and animation after component mounts
    if (onMount) {
      onMount();
    }
    
    // Trigger fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [onMount]);

  // Function to format summary content
  const formatSummaryContent = (summary) => {
    let bulletPointsHtml = '';
    let paragraphHtml = '';

    // Extract Bullet Point Summary section
    const bulletPointsMatch = summary.match(/## Bullet Point Summary\n([\s\S]*?)(?=## Paragraph Summary|$)/);
    if (bulletPointsMatch && bulletPointsMatch[1]) {
      let rawBulletPoints = bulletPointsMatch[1].trim();
      
      // Process bullet points with proper nesting
      const lines = rawBulletPoints.split('\n').filter(line => line.trim());
      const bulletItems = [];
      let currentItem = null;

      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        // Check for main bullet points (starts with -)
        if (trimmedLine.startsWith('- ')) {
          const content = trimmedLine.replace(/^- /, '').replace(/\*\*/g, ''); // Remove ** markers
          const colonIndex = content.indexOf(':');
          
          if (colonIndex > 0) {
            // This is a main category with a colon
            const category = content.substring(0, colonIndex).trim();
            const description = content.substring(colonIndex + 1).trim();
            
            // Save previous item if exists
            if (currentItem) {
              bulletItems.push(currentItem);
            }
            
            // Start new main category
            currentItem = {
              category: category,
              description: description
            };
          } else {
            // This is a main item without a colon
            if (currentItem) {
              bulletItems.push(currentItem);
            }
            
            currentItem = {
              category: content,
              description: ''
            };
          }
        }
      });


      // Add the last item
      if (currentItem) {
        bulletItems.push(currentItem);
      }

      bulletPointsHtml = (
               <ul className="bullet-list">
                 {bulletItems.map((item, index) => (
                   <li 
                     key={index} 
                     className="bullet-item"
                     onMouseEnter={() => setHoveredItemIndex(index)}
                     onMouseLeave={() => setHoveredItemIndex(null)}
                   >
                     <span className="bullet-category">
                       <ScrambledText 
                         text={`${item.category}:`} 
                         speed={100} 
                         delay={0}
                         shouldScramble={hoveredItemIndex === index}
                       />
                     </span>
                     {item.description && (
                       <span className="bullet-text">
                         {' '}
                         <ScrambledText 
                           text={item.description} 
                           speed={120} 
                           delay={0}
                           shouldScramble={hoveredItemIndex === index}
                         />
                       </span>
                     )}
                   </li>
                 ))}
               </ul>
      );
    }

    // Extract Paragraph Summary section
    const paragraphMatch = summary.match(/## Paragraph Summary\n([\s\S]*)/);
    if (paragraphMatch && paragraphMatch[1]) {
      let rawParagraph = paragraphMatch[1].trim();
      
      // Clean up any trailing random characters and ensure proper ending
      // Remove all trailing non-letter characters except periods
      rawParagraph = rawParagraph.replace(/[^a-zA-Z0-9\.\s]+$/, '');
      rawParagraph = rawParagraph.trim();
      
      // If it doesn't end with a period, add one
      if (!rawParagraph.endsWith('.')) {
        rawParagraph += '.';
      }
      paragraphHtml = (
        <div className="paragraph-text">
          <DecryptedText 
            text={rawParagraph} 
            speed={8} 
            delay={500}
          />
        </div>
      );
    }

    return { bulletPointsHtml, paragraphHtml };
  };

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

  const { bulletPointsHtml, paragraphHtml } = formatSummaryContent(data.summary);

  return (
    <div 
      id="results" 
      className={`fade-in ${isVisible ? 'visible' : ''}`}
    >
      <h2 className="results-header">
        <ShinyText 
          text="Security Analysis Results" 
          disabled={false} 
          speed={3} 
          className='results-shiny' 
        />
      </h2>
      <div className="results-ip">Analyzing: {ip}</div>
      
      <div className="summary-container">
        {/* Bullet Points Section */}
        <div className="summary-section">
          <h3 className="summary-title">Bullet Point Summary</h3>
          <div className="summary-content">
            {bulletPointsHtml}
          </div>
        </div>

        {/* Paragraph Section */}
        <div className="summary-section">
          <h3 className="summary-title">Paragraph Summary</h3>
          <div className="summary-content">
            {paragraphHtml}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
