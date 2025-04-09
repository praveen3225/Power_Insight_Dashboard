// TimeModeSelector.jsx
import React from 'react';
import './TimeModeSelector.css';

const TimeModeSelector = ({ timeMode, setTimeMode }) => {
  const modes = ['m', 'H', 'D', 'M', 'Y'];

  return (
    <div className="mode-container">
      {modes.map((mode) => (
        <button
          key={mode}
          className={`mode-button ${timeMode === mode ? 'active' : ''}`}
          onClick={() => setTimeMode(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};

export default TimeModeSelector;
