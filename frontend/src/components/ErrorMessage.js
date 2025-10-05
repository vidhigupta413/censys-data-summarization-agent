import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <p className="error-text">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
