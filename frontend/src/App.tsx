import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bot, User, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  model?: string;
  tokensUsed?: number;
  timestamp: Date;
  fallback?: boolean;
}

interface AIModel {
  id: string;
  name: string;
  available: boolean;
  description: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini');
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('multi-ai-chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load messages from localStorage:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('multi-ai-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch available models on component mount
  useEffect(() => {
    fetchModels();
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setIsConnected(true);
      }
    } catch (error) {
      setIsConnected(false);
      console.error('Server health check failed:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      if (response.ok) {
        const models = await response.json();
        setAvailableModels(models);
        
        // Set default model to first available one
        const availableModel = models.find((model: AIModel) => model.available);
        if (availableModel && !selectedModel) {
          setSelectedModel(availableModel.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          model: selectedModel,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          model: data.model,
          tokensUsed: data.tokensUsed,
          timestamp: new Date(),
          fallback: data.fallback
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or switch to a different model.`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('multi-ai-chat-messages');
  };

  const getModelBadgeColor = (modelId: string) => {
    switch (modelId) {
      case 'gemini': return 'bg-blue-100 text-blue-800';
      case 'openai': return 'bg-green-100 text-green-800';
      case 'huggingface': return 'bg-yellow-100 text-yellow-800';
      case 'mistral': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 mb-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-gray-600" />
        </div>
      </div>
      <div className="typing-indicator bg-gray-100 rounded-lg">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Multi-AI Chat</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {isConnected ? (
                    <><CheckCircle2 size={14} className="text-green-500" /> Connected</>
                  ) : (
                    <><AlertCircle size={14} className="text-red-500" /> Disconnected</>
                  )}
                </div>
              </div>
            </div>
            
            {/* Model Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id} disabled={!model.available}>
                    {model.name} {!model.available && '(Unavailable)'}
                  </option>
                ))}
              </select>
              
              <button
                onClick={clearChat}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <Bot size={64} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Welcome to Multi-AI Chat!</h2>
              <p className="text-gray-400">Start a conversation with multiple AI models. Choose your preferred model above and type a message below.</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {availableModels.map((model) => (
                  <div key={model.id} className={clsx(
                    "p-4 rounded-lg border text-left",
                    model.available 
                      ? "bg-white border-gray-200 hover:border-gray-300" 
                      : "bg-gray-50 border-gray-100 opacity-50"
                  )}>
                    <h3 className="font-medium text-sm mb-1">{model.name}</h3>
                    <p className="text-xs text-gray-500">{model.description}</p>
                    {!model.available && <p className="text-xs text-red-500 mt-1">API key not configured</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    "flex items-start space-x-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-gray-600" />
                      </div>
                    </div>
                  )}
                  
                  <div className={clsx(
                    "chat-bubble",
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-white border border-gray-200 text-gray-900'
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          {message.model && (
                            <span className={clsx(
                              "px-2 py-1 rounded text-xs font-medium",
                              getModelBadgeColor(message.model.split('-')[0] || message.model)
                            )}>
                              {message.model}
                            </span>
                          )}
                          {message.fallback && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              Fallback
                            </span>
                          )}
                        </div>
                        {message.tokensUsed && (
                          <span className="text-xs text-gray-500">
                            {message.tokensUsed} tokens
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Server disconnected..."}
                disabled={isLoading || !isConnected}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !isConnected}
              className={clsx(
                "px-4 py-3 rounded-lg font-medium transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                !inputMessage.trim() || isLoading || !isConnected
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div>
              Press Enter to send, Shift+Enter for new line
            </div>
            {selectedModel && (
              <div>
                Using: <span className="font-medium">
                  {availableModels.find(m => m.id === selectedModel)?.name || selectedModel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;