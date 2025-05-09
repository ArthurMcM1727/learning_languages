import { useState } from 'react';
import './App.css';

function App() {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [guessCount, setGuessCount] = useState(0);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guess = parseInt(inputValue);
    if (isNaN(guess)) {
      setResult('Please enter a number!');
      return;
    }

    setGuessCount(prev => prev + 1);

    if (guess === targetNumber) {
      setResult(`🎉 Correct! You guessed it in ${guessCount + 1} tries.`);
    } else if (guess > targetNumber) {
      setResult('Too high!');
    } else {
      setResult('Too low!');
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setInputValue('');
    setResult('');
    setGuessCount(0);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Guess the Number</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter a number 1-100"
        />
        <button type="submit">Guess</button>
      </form>
      <p>{result}</p>
      <p>Attempts: {guessCount}</p>
      {result.includes('Correct') && (
        <button onClick={resetGame}>Play Again</button>
      )}
    </div>
  );
}

export default App;
