/**
 * ScrambledText Component
 * 
 * This component creates a scrambled text effect using :. characters
 * that continuously animates while hovering, similar to shadcn components.
 */

import React, { useState, useEffect, useRef } from 'react';

/**
 * ScrambledText component props
 * @typedef {Object} ScrambledTextProps
 * @property {string} text - The text to scramble
 * @property {number} speed - Animation speed in milliseconds
 * @property {number} delay - Delay before animation starts
 * @property {boolean} shouldScramble - Whether scrambling should be active
 * @property {string} className - Additional CSS classes
 */

/**
 * ScrambledText component
 * @param {ScrambledTextProps} props - Component props
 * @returns {JSX.Element} The ScrambledText component
 */
const ScrambledText = ({ 
  text, 
  speed = 100, 
  delay = 0, 
  shouldScramble = false, 
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  // Characters to use for scrambling
  const scrambleChars = '.:';

  useEffect(() => {
    if (shouldScramble) {
      // Start scrambling immediately
      const startScrambling = () => {
        intervalRef.current = setInterval(() => {
          // Generate scrambled text of the same length
          const scrambled = Array.from({ length: text.length }, () => 
            scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          ).join('');
          setDisplayText(scrambled);
        }, speed);
      };

      // Add delay if specified
      if (delay > 0) {
        const timeout = setTimeout(startScrambling, delay);
        return () => clearTimeout(timeout);
      } else {
        startScrambling();
      }
    } else {
      // Stop scrambling and show original text
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayText(text);
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldScramble, text, speed, delay]);

  return (
    <span 
      className={`scrambled-text ${shouldScramble ? 'scrambling' : 'normal'} ${className}`}
    >
      {displayText}
    </span>
  );
};

export default ScrambledText;
