import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes, FaPaperPlane, FaHeadset } from "react-icons/fa";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate agent coming online
    const onlineInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.3);
    }, 30000);

    return () => clearInterval(onlineInterval);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponses = [
        "Thank you for your message! How can I help you today?",
        "I'd be happy to assist you with that. Could you please provide more details?",
        "That's a great question! Let me check that for you.",
        "I understand. One moment while I look into this for you.",
        "Thanks for reaching out! Our team is available 24/7 to help you.",
        "I can definitely help with that. What specific information do you need?",
        "Perfect! I'll connect you with the right specialist for this.",
        "Is there anything else I can help you with?"
      ];

      const agentMessage = {
        id: Date.now() + 1,
        text: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        sender: "agent",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const quickQuestions = [
    "What are your shipping options?",
    "How can I track my order?",
    "What's your return policy?",
    "Do you offer custom jewelry?",
    "How do I care for my jewelry?"
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#f4c542] text-white p-4 rounded-full shadow-lg hover:bg-[#caa43b] transition-all transform hover:scale-110"
          title="Chat with us"
        >
          <div className="relative">
            <FaComments size={24} />
            {isOnline && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B0B0B] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[#f4c542] rounded-full flex items-center justify-center">
                  <FaHeadset />
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0B0B]"></span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-gray-300">
                  {isOnline ? "Online" : "Away"} • Typically replies in 5 min
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#f4c542] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeadset size={32} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Welcome to Thiaworld Support
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  How can we help you today?
                </p>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="block w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-[#f4c542] text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-[#f4c542] text-white rounded-full hover:bg-[#caa43b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;
