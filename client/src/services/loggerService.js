import axios from 'axios';

class LoggerService {
  constructor() {
    this.logQueue = [];
    this.isProcessing = false;
    this.userId = null;
    this.sessionId = null;
    this.userRole = null;
    this.isActive = false; // Only log when active (students only)
    this.batchSize = 50;
    this.flushInterval = 5000; // 5 seconds
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  init(userId, sessionId, userRole) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.userRole = userRole;
    
    // Only activate logging for students
    if (userRole === 'student') {
      this.isActive = true;
      this.startBatchProcessor();
      
      // Note: Removed session_start logging - only log clicks, typing, and navigation
    } else {
      this.isActive = false;
    }
  }

  log(action, details = {}) {
    // Return early if not a student
    if (!this.isActive || this.userRole !== 'student') {
      return null;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      action: action,
      details: {
        ...details,
        url: window.location.pathname,
        userAgent: navigator.userAgent
      },
      id: this.generateLogId()
    };

    // Add to queue
    this.logQueue.push(logEntry);
    
    // Save to localStorage as backup
    this.saveToLocalStorage(logEntry);
    
    return logEntry;
  }

  generateLogId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  saveToLocalStorage(logEntry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('studentActionLogs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 1000 logs in localStorage to prevent overflow
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      localStorage.setItem('studentActionLogs', JSON.stringify(existingLogs));
    } catch (error) {
      // Silently handle localStorage errors
    }
  }

  startBatchProcessor() {
    // Periodic flush
    setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushLogsSync();
    });
  }

  async flushLogs() {
    if (this.isProcessing || this.logQueue.length === 0 || !this.isActive) return;

    this.isProcessing = true;
    const logsToSend = this.logQueue.splice(0, this.batchSize);

    try {
      await axios.post(`${this.apiUrl}/api/logs`, { 
        logs: logsToSend,
        sessionId: this.sessionId,
        userId: this.userId
      });
      
      // Remove sent logs from localStorage
      this.removeProcessedLogsFromLocalStorage(logsToSend);
    } catch (error) {
      // Put logs back in queue for retry
      this.logQueue.unshift(...logsToSend);
    } finally {
      this.isProcessing = false;
    }
  }

  flushLogsSync() {
    // Synchronous version for page unload
    if (this.logQueue.length === 0 || !this.isActive) return;
    
    try {
      navigator.sendBeacon(`${this.apiUrl}/api/logs`, JSON.stringify({
        logs: this.logQueue,
        sessionId: this.sessionId,
        userId: this.userId
      }));
    } catch (error) {
      // Silently handle unload errors
    }
  }

  removeProcessedLogsFromLocalStorage(processedLogs) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('studentActionLogs') || '[]');
      const processedIds = new Set(processedLogs.map(log => log.id));
      const remainingLogs = existingLogs.filter(log => !processedIds.has(log.id));
      localStorage.setItem('studentActionLogs', JSON.stringify(remainingLogs));
    } catch (error) {
      // Silently handle cleanup errors
    }
  }

  // Manual log methods for specific student actions
  logTextEntry(elementId, value, component) {
    this.log('student_text_entry', {
      component,
      elementId,
      value: value.slice(0, 500), // Limit value length
      valueLength: value.length
    });
  }

  logClick(element, component) {
    this.log('student_click', {
      component,
      elementId: element.id || 'unknown',
      elementClass: element.className || 'none',
      tagName: element.tagName.toLowerCase(),
      text: element.textContent?.slice(0, 100) || '',
      x: element.offsetLeft,
      y: element.offsetTop
    });
  }

  logNavigation(from, to) {
    this.log('student_navigation', { from, to });
  }

  logFormSubmit(formId, formData, component) {
    this.log('student_form_submit', {
      component,
      formId,
      fieldCount: Object.keys(formData).length,
      fields: Object.keys(formData)
    });
  }

  logAnswerSubmit(questionId, answer, component) {
    this.log('student_answer_submit', {
      component,
      questionId,
      answerLength: answer ? answer.length : 0,
      hasContent: answer && answer.trim().length > 0
    });
  }

  logAnswerModified(questionId, answer, component) {
    this.log('student_answer_modified', {
      component,
      questionId,
      answerLength: answer ? answer.length : 0
    });
  }
}

const loggerService = new LoggerService();

// Make logger available globally for debugging
if (typeof window !== 'undefined') {
  window.loggerService = loggerService;
}

export default loggerService;