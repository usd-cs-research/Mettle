import { useEffect } from 'react';
import loggerService from '../services/loggerService';

const useActionLogger = (componentName) => {
  useEffect(() => {
    // Check if logging is active (student only)
    if (!loggerService.isActive) {
      return; // Exit early for teachers
    }

    // Text input logging
    const handleInput = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        loggerService.logTextEntry(
          event.target.id || event.target.name || 'unknown',
          event.target.value,
          componentName
        );
      }
    };

    // Click logging
    const handleClick = (event) => {
      loggerService.logClick(event.target, componentName);
    };

    // Note: Removed focus logging to reduce noise - only track clicks, typing, and navigation

    // Form submission logging
    const handleSubmit = (event) => {
      if (event.target.tagName === 'FORM') {
        const formData = new FormData(event.target);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        
        loggerService.logFormSubmit(
          event.target.id || 'unknown',
          formObject,
          componentName
        );
      }
    };

    // Key press logging for special keys
    const handleKeyPress = (event) => {
      // Log special keys like Enter, Tab, Escape
      if (['Enter', 'Tab', 'Escape'].includes(event.key)) {
        loggerService.log('student_keypress', {
          component: componentName,
          key: event.key,
          elementId: event.target.id || 'unknown',
          elementType: event.target.tagName
        });
      }
    };

    // Add event listeners only for students (only clicks, typing, navigation)
    document.addEventListener('input', handleInput, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('submit', handleSubmit, true);
    document.addEventListener('keypress', handleKeyPress, true);

    // Note: Removed component mount logging to reduce noise

    // Cleanup function
    return () => {
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleSubmit, true);
      document.removeEventListener('keypress', handleKeyPress, true);
      
      // Note: Removed component unmount logging to reduce noise
    };
  }, [componentName]);

  // Return the logger in case direct logging is needed
  return loggerService;
};

export default useActionLogger;