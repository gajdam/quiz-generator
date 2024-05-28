import { useState } from 'react';
import PropTypes from 'prop-types';

const Quiz = ({ data }) => {
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

  return (
    <div>
      {showScore ? (
        <div>You scored {score} out of {data.length}</div>
      ) : (
        <div>
          <div>{data[currentQuestionIndex].question}</div>
          {data[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              style={{
                backgroundColor: selectedOption === index ? (option.isCorrect ? 'green' : 'red') : ''
              }}
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
  };

export default Quiz;