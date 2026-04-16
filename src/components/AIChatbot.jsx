import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import useStore from '../store/useStore';
import './AIChatbot.css';

const SUGGESTIONS = [
  'Best route home?',
  'Safety tips for night',
  'Traffic updates',
  'How to use SOS?',
];

export default function AIChatbot() {
  const { isChatOpen, toggleChat, closeChat } = useStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "👋 Hi! I'm MoveSmart AI, your mobility assistant. I can help with routes, safety tips, and travel planning. How can I help?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(text.trim());
      const botMsg = { id: Date.now() + 1, role: 'bot', text: response };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: "Sorry, I couldn't process that right now. Please try again!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isChatOpen && (
        <button className="chatbot-fab" onClick={toggleChat} id="ai-chatbot-fab" aria-label="Open AI Assistant">
          <Bot size={26} />
          <span className="fab-badge" />
        </button>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <>
          <div className="chat-overlay" onClick={closeChat} />
          <div className="chat-panel" id="ai-chat-panel">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-avatar">🤖</div>
                <div className="chat-header-info">
                  <h3>MoveSmart AI</h3>
                  <span>Online</span>
                </div>
              </div>
              <button className="chat-close" onClick={closeChat} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message bot typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form className="chat-input-bar" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                id="ai-chat-input"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
