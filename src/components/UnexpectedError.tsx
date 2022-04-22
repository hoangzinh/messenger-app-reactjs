import React from 'react';
import '../error.css';

const UnexpectedError = () => (
  <div>
    <p className="error-text">
      Oops..
      <br />
      something went wrong
    </p>
    <div className="error-container">
      <div className="bg">
        <div className="light"></div>
      </div>
      <div className="ufo">
        <div className="ufo-bottom"></div>
        <div className="ufo-top"></div>
        <div className="ufo-glass">
          <div className="alien">
            <div className="alien-eye"></div>
          </div>
        </div>
      </div>
      <div className="bed">
        <div className="mattress"></div>
      </div>
      <div className="man">
        <div className="foot"></div>
        <div className="head">
          <div className="face"></div>
          <div className="hair"></div>
        </div>
        <div className="man-body"></div>
        <div className="arm"></div>
      </div>
    </div>
  </div>
);

export default UnexpectedError;
