// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// --- NEW: Emoji mapping object ---
// We create a simple dictionary to map the API's response to an emoji.
const emotionEmojis = {
  joy: '😄',
  sadness: '😢',
  love: '🥰',
  anger: '😠',
  fear: '😨',
  surprise: '😮',
};

function App() {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/analyze', { sentence });
      setResult(response.data);
    } catch (err) {
      setError('Failed to get a response. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Emotion Analyzer</h1>
        <p>Enter a sentence and my AI model will predict the emotion!</p>
        <form onSubmit={handleSubmit} className="emotion-form">
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Type something here..."
            rows="4"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {result && (
          <div className="result-card">
            <h2>Result</h2>
            {/* --- UPDATED: The emotion label now includes the emoji --- */}
            <p className="emotion-label">
              <span role="img" aria-label={result.emotion}>
                {emotionEmojis[result.emotion] || '🤔'}
              </span>
              {result.emotion.toUpperCase()}
            </p>
            <p className="confidence-score">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;