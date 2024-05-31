import { useState } from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';

const Quiz = ({ data, onNewFile }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleOptionClick = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (data[currentQuestionIndex].options[optionIndex].isCorrect) {
      setScore(score + 1);
    }
    setHasAnswered(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    if (currentQuestionIndex >= data.length - 1) {
      setShowScore(true);
    }
    setHasAnswered(false);
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
          <div className="score-display">You got {Math.round((score / data.length) * 100)} %</div>
          <button onClick={handlePlayAgain} className="option-button">Play Again</button>
          <button onClick={onNewFile} className="option-button">New File</button>
        </div>
      ) : (
          <div>
            <div className="question-display">{data[currentQuestionIndex].question}</div>
            <div>
              {data[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`
          option-button 
          ${selectedOption === index ? (option.isCorrect ? 'correct' : 'wrong') : ''}
          ${hasAnswered && option.isCorrect ? 'correct' : ''}
        `}
                  disabled={hasAnswered}
                >
                  {option.option}
                </button>
              ))}
            </div>
            <button onClick={nextQuestion} className="option-button" disabled={!hasAnswered}>Next Question</button>
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