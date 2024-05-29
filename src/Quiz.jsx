import { useState } from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';

const Quiz = ({ data, onNewFile }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleOptionClick = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (data[currentQuestionIndex].options[optionIndex].isCorrect) {
      setScore(score + 1);
    }
    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    if (currentQuestionIndex >= data.length - 1) {
      setShowScore(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div className="quiz-container">
      {showScore ? (
        <div>
          <div className="score-display">You scored {score} out of {data.length}</div>
          <button onClick={handlePlayAgain} className="option-button">Play Again</button>
          <button onClick={onNewFile} className="option-button">New File</button>
        </div>
      ) : (
        <div>
          <div className="question">{data[currentQuestionIndex].question}</div>
          {data[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`option-button ${selectedOption === index ? (option.isCorrect ? 'correct' : 'incorrect') : ''}`}
            >
              {option.option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Quiz.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            option: PropTypes.string.isRequired,
            isCorrect: PropTypes.bool.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    onNewFile: PropTypes.func.isRequired,
  };

export default Quiz;