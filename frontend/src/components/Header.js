import React from 'react';
import ShinyText from './ShinyText';

const Header = () => {
  return (
    <header className="header text-center">
      <h1 className="header-title">
        <ShinyText 
          text="Censys Data Summarization Agent" 
          disabled={false} 
          speed={3} 
          className='header-shiny' 
        />
      </h1>
      <p className="header-subtitle">
        Analyze Host Security Data with AI-Powered Insights
      </p>
    </header>
  );
};

export default Header;
