import React, { useState } from 'react';
import useActionLogger from '../../hooks/useActionLogger';

const ExampleComponent = (props) => {
  // This hook automatically logs all student interactions in this component
  const logger = useActionLogger('ExampleComponent');
  
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    
    // ✅ Optional: Add custom logging for specific events
    if (e.target.value.length > 0 && answer.length === 0) {
      logger.log('student_started_typing', {
        questionId: props.questionId,
        component: 'ExampleComponent'
      });
    }
  };

  const handleSubmit = () => {
    // ✅ Custom logging for answer submission
    logger.logAnswerSubmit(props.questionId, answer, 'ExampleComponent');
    
    // Your submit logic here...
    console.log('Submitting answer:', answer);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    // ✅ Custom logging for option selection
    logger.log('student_option_selected', {
      questionId: props.questionId,
      selectedOption: option,
      component: 'ExampleComponent'
    });
  };

  return (
    <div className="example-component">
      <h2>Student Problem Solving Interface</h2>
      
      {/* ✅ Text input - automatically logged */}
      <div className="question-section">
        <label htmlFor="answer-input">Your Answer:</label>
        <textarea
          id="answer-input"
          name="studentAnswer"
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Type your reasoning here..."
          rows={5}
        />
      </div>

      {/* ✅ Multiple choice - automatically logged */}
      <div className="options-section">
        <h3>Select an approach:</h3>
        {['Option A', 'Option B', 'Option C'].map((option, index) => (
          <button
            key={index}
            id={`option-${index}`}
            className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* ✅ Form submission - automatically logged */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <button 
          type="submit" 
          id="submit-answer"
          disabled={!answer.trim()}
        >
          Submit Answer
        </button>
      </form>

      {/* ✅ Navigation buttons - automatically logged */}
      <div className="navigation">
        <button id="prev-step" onClick={() => console.log('Previous step')}>
          Previous Step
        </button>
        <button id="next-step" onClick={() => console.log('Next step')}>
          Next Step
        </button>
      </div>
    </div>
  );
};

export default ExampleComponent;