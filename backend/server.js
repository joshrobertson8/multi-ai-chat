import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
import { Mistral } from '@mistralai/mistralai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize AI clients
const initializeClients = () => {
  const clients = {};
  
  // Google Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      clients.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('✅ Gemini client initialized');
    } catch (error) {
      console.log('❌ Failed to initialize Gemini:', error.message);
    }
  }
  
  // Hugging Face
  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      clients.huggingface = new HfInference(process.env.HUGGINGFACE_API_KEY);
      console.log('✅ Hugging Face client initialized');
    } catch (error) {
      console.log('❌ Failed to initialize Hugging Face:', error.message);
    }
  }
  
  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      clients.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI client initialized');
    } catch (error) {
      console.log('❌ Failed to initialize OpenAI:', error.message);
    }
  }
  
  // Mistral
  if (process.env.MISTRAL_API_KEY) {
    try {
      clients.mistral = new Mistral({
        apiKey: process.env.MISTRAL_API_KEY,
      });
      console.log('✅ Mistral client initialized');
    } catch (error) {
      console.log('❌ Failed to initialize Mistral:', error.message);
    }
  }
  
  return clients;
};

const clients = initializeClients();

// AI Model handlers
const handleGeminiRequest = async (message, conversationHistory = []) => {
  if (!clients.gemini) {
    throw new Error('Gemini client not available');
  }
  
  try {
    const model = clients.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format conversation history for Gemini
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return {
      content: response.text(),
      model: 'gemini-1.5-flash',
      tokensUsed: response.candidates?.[0]?.tokenCount || 0
    };
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
};

const handleHuggingFaceRequest = async (message, conversationHistory = []) => {
  if (!clients.huggingface) {
    throw new Error('Hugging Face client not available');
  }
  
  try {
    // Use a conversation-aware approach
    const conversationText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') + `\nUser: ${message}\nAssistant:`;
    
    const response = await clients.huggingface.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: conversationText,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        return_full_text: false
      }
    });
    
    return {
      content: response.generated_text.trim(),
      model: 'microsoft/DialoGPT-medium',
      tokensUsed: response.generated_text.length // Approximate
    };
  } catch (error) {
    console.error('Hugging Face error:', error);
    throw new Error(`Hugging Face API error: ${error.message}`);
  }
};

const handleOpenAIRequest = async (message, conversationHistory = []) => {
  if (!clients.openai) {
    throw new Error('OpenAI client not available');
  }
  
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];
    
    const response = await clients.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7
    });
    
    return {
      content: response.choices[0].message.content,
      model: 'gpt-4o-mini',
      tokensUsed: response.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

const handleMistralRequest = async (message, conversationHistory = []) => {
  if (!clients.mistral) {
    throw new Error('Mistral client not available');
  }
  
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];
    
    const response = await clients.mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: messages,
      maxTokens: 150,
      temperature: 0.7
    });
    
    return {
      content: response.choices[0].message.content,
      model: 'mistral-small-latest',
      tokensUsed: response.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('Mistral error:', error);
    throw new Error(`Mistral API error: ${error.message}`);
  }
};

// Routes
app.get('/health', (req, res) => {
  const availableModels = Object.keys(clients);
  res.json({
    status: 'healthy',
    availableModels,
    timestamp: new Date().toISOString()
  });
});

app.get('/models', (req, res) => {
  const models = [
    {
      id: 'gemini',
      name: 'Google Gemini 1.5 Flash',
      available: !!clients.gemini,
      description: 'Google\'s fast, versatile AI model'
    },
    {
      id: 'huggingface',
      name: 'Hugging Face DialoGPT',
      available: !!clients.huggingface,
      description: 'Conversational AI model from Microsoft'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4o Mini',
      available: !!clients.openai,
      description: 'OpenAI\'s efficient, cost-effective model'
    },
    {
      id: 'mistral',
      name: 'Mistral Small',
      available: !!clients.mistral,
      description: 'Mistral\'s balanced performance model'
    }
  ];
  
  res.json(models);
});

app.post('/chat', async (req, res) => {
  try {
    const { message, model, conversationHistory = [] } = req.body;
    
    if (!message || !model) {
      return res.status(400).json({ error: 'Message and model are required' });
    }
    
    let response;
    
    // Route to appropriate handler
    switch (model) {
      case 'gemini':
        response = await handleGeminiRequest(message, conversationHistory);
        break;
      case 'huggingface':
        response = await handleHuggingFaceRequest(message, conversationHistory);
        break;
      case 'openai':
        response = await handleOpenAIRequest(message, conversationHistory);
        break;
      case 'mistral':
        response = await handleMistralRequest(message, conversationHistory);
        break;
      default:
        return res.status(400).json({ error: 'Invalid model specified' });
    }
    
    res.json({
      success: true,
      response: response.content,
      model: response.model,
      tokensUsed: response.tokensUsed,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    
    // Try fallback to available models
    const availableModels = Object.keys(clients);
    if (availableModels.length > 0 && req.body.model !== availableModels[0]) {
      try {
        console.log(`Trying fallback model: ${availableModels[0]}`);
        const fallbackResponse = await handleFallback(req.body.message, availableModels[0], req.body.conversationHistory);
        
        return res.json({
          success: true,
          response: fallbackResponse.content,
          model: fallbackResponse.model,
          tokensUsed: fallbackResponse.tokensUsed,
          fallback: true,
          originalError: error.message,
          timestamp: new Date().toISOString()
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
    
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const handleFallback = async (message, model, conversationHistory) => {
  switch (model) {
    case 'gemini':
      return await handleGeminiRequest(message, conversationHistory);
    case 'huggingface':
      return await handleHuggingFaceRequest(message, conversationHistory);
    case 'openai':
      return await handleOpenAIRequest(message, conversationHistory);
    case 'mistral':
      return await handleMistralRequest(message, conversationHistory);
    default:
      throw new Error('No fallback model available');
  }
};

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log('🤖 Available AI models:', Object.keys(clients));
});