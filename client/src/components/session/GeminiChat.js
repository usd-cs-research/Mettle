import React, { useState, useEffect } from 'react';
import { sessionSocket } from '../../services/socket';

export default function GeminiChat({ sessionId, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGeminiResponse = (data) => {
      setMessages(prev => [...prev, { type: 'response', text: data.response, query: data.query }]);
      setIsLoading(false);
    };

    const handleGeminiError = (data) => {
      setMessages(prev => [...prev, { type: 'error', text: data.message }]);
      setIsLoading(false);
    };

    sessionSocket.on('gemini-response', handleGeminiResponse);
    sessionSocket.on('gemini-error', handleGeminiError);

    return () => {
      sessionSocket.off('gemini-response', handleGeminiResponse);
      sessionSocket.off('gemini-error', handleGeminiError);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages(prev => [...prev, { type: 'query', text: query }]);
    setIsLoading(true);
    sessionSocket.emit('gemini-query', { sessionId, userId, query });
    setQuery('');
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const clearHistory = () => setMessages([]);

  return (
    <div className="gemini-chat">
      <button onClick={toggleChat} className="chat-toggle" aria-label={isOpen ? 'Hide Gemini chatbot' : 'Show Gemini chatbot'}>
        {isOpen ? 'Hide Gemini' : 'Show Gemini'}
      </button>
      {isOpen && (
        <div className="chat-window" role="dialog" aria-labelledby="chat-header">
          <div className="chat-header" id="chat-header">
            <h3>Gemini Chatbot</h3>
            <button onClick={clearHistory} aria-label="Clear chat history">Clear</button>
          </div>
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'query' && <strong>You:</strong>}
                {msg.type === 'response' && <strong>Gemini:</strong>}
                {msg.type === 'error' && <strong>Error:</strong>}
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && <div className="loading" aria-live="assertive">Gemini is thinking...</div>}
          </div>
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Gemini for guidance..."
              disabled={isLoading}
              aria-label="Enter your question for Gemini"
            />
            <button type="submit" disabled={isLoading} aria-label="Send question to Gemini">Send</button>
          </form>
          <div className="attribution">
            Powered by Gemini. Responses are for guidance only.
          </div>
        </div>
      )}
    </div>
  );
}