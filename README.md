# 🤖 Multi-AI Chat Application

> **Built with ⚡ Perplexity AI** - A responsive web chat application that lets users communicate with multiple free AI models in one interface.

![Multi-AI Chat](https://img.shields.io/badge/Multi--AI-Chat-blue?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

## ✨ Features

✅ **Multiple AI Models**: Switch between Hugging Face, Google Gemini, OpenAI GPT-4o Mini, and Mistral AI  
✅ **Real-time Chat**: Responsive interface with animated typing indicators  
✅ **Persistent History**: Chat history stored locally using localStorage  
✅ **Smart Fallback**: Automatic fallback to available models if one fails  
✅ **Token Tracking**: Monitor API usage and token consumption  
✅ **Responsive Design**: Works seamlessly on desktop and mobile  
✅ **Error Handling**: Comprehensive error handling with user-friendly messages  
✅ **CORS Ready**: Properly configured for cross-origin requests  

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 🟢
- npm or yarn 📦
- At least one AI service API key 🔑

### One-Command Setup

```bash
# Clone and install everything
git clone https://github.com/joshrobertson8/multi-ai-chat.git
cd multi-ai-chat
npm run install-all
```

### Configure API Keys

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys (see setup guide below)
```

### Start Development

```bash
# Start both backend and frontend
npm run dev
```

🎆 **Open [http://localhost:5173](http://localhost:5173) and start chatting!**

## 🔑 API Keys Setup Guide

### 🤗 Hugging Face (Easiest Start)

**Free Tier**: 1,000 requests/day for signed users

1. 👤 [Sign up at Hugging Face](https://huggingface.co/join)
2. ⚙️ Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. ➕ Click "New token" → Name it → Select "Read" permissions
4. 📋 Copy token (starts with `hf_`)
5. 📁 Add to `.env`: `HUGGINGFACE_API_KEY=hf_your_token`

### 🔮 Google Gemini (Most Generous)

**Free Tier**: 15 requests/minute, 1,500 requests/day

1. 👤 Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 🔑 Click "Create API Key"
3. 📋 Copy the generated key
4. 📁 Add to `.env`: `GEMINI_API_KEY=your_gemini_key`

### 🧠 OpenAI GPT-4o Mini (Most Capable)

**Pricing**: $0.15/1M input tokens, $0.60/1M output (~$0.0004/message)  
**Free Credit**: $5 for new users

1. 👤 [Create OpenAI account](https://platform.openai.com/signup)
2. 💳 Add payment method (required even for free credits)
3. 🔑 Generate key at [API Keys](https://platform.openai.com/api-keys)
4. 📋 Copy key (starts with `sk-`)
5. 📁 Add to `.env`: `OPENAI_API_KEY=sk-your_key`

### 🌟 Mistral AI

**Free Tier**: Limited requests per second and tokens per minute

1. 👤 [Sign up at Mistral Console](https://console.mistral.ai/)
2. 🔑 Navigate to API Keys section
3. ➕ Generate new API key
4. 📁 Add to `.env`: `MISTRAL_API_KEY=your_mistral_key`

## 📁 Project Structure

```
multi-ai-chat/
├── 🏠 backend/              # Node.js + Express server
│   ├── server.js           # Main server with AI integrations
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment template
├── 🎨 frontend/            # React + TypeScript app
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   └── index.css      # TailwindCSS styles
│   └── vite.config.ts     # Vite configuration
├── 📝 SETUP_GUIDE.md      # Detailed setup instructions
├── 🐛 CONTRIBUTING.md    # Contribution guidelines
└── 📄 package.json        # Root package with scripts
```

## 🎯 Usage Examples

### Basic Chat
```
👤 User: "Explain quantum computing"
🤖 AI: "Quantum computing leverages quantum mechanics..."
```

### Model Comparison
```
👤 User: "Write a haiku about coding"
🔮 Gemini: "Functions and loops dance / Variables store fleeting dreams / Code becomes alive"
🧠 OpenAI: "Code flows like water / Bugs hide in shadow and light / Coffee fuels the fix"
```

### Multi-turn Conversation
```
👤 User: "What's the weather like?"
🤖 AI: "I don't have access to real-time weather data..."
👤 User: "Can you write a poem about sunny weather instead?"
🤖 AI: "Golden rays dance bright / Warming earth with gentle kiss..."
```

## 🔄 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health and available models |
| `GET` | `/models` | List all supported models |
| `POST` | `/chat` | Send message to AI model |

### Chat Request
```json
{
  "message": "Hello, how are you?",
  "model": "gemini",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

### Chat Response
```json
{
  "success": true,
  "response": "AI response text",
  "model": "gemini-1.5-flash",
  "tokensUsed": 42,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "fallback": false
}
```

## 📊 Rate Limits & Costs

| Service | Free Limits | Cost (Paid) | Best For |
|---------|------------|-------------|----------|
| **Gemini** | 15/min, 1,500/day | Pay-per-use | 🎆 Daily use |
| **Hugging Face** | 1,000/day | $9/month Pro | 🗚️ Development |
| **OpenAI Mini** | $5 credit | $0.0004/msg | 🏆 Quality responses |
| **Mistral** | Limited | Tier-based | 🛠️ Experimentation |

## 🛠️ Development

### Available Scripts

```bash
npm run install-all    # Install all dependencies
npm run dev           # Start both servers in development
npm start             # Start production backend
npm run build         # Build frontend for production
```

### Adding New AI Models

1. 📦 Install the AI SDK in backend
2. 🇿 Create handler function in `server.js`
3. ➕ Add model to `/models` endpoint
4. 🎨 Update frontend model colors
5. 📝 Update documentation

## 🐛 Troubleshooting

### Common Issues

**"Server disconnected"**
```bash
# Check if backend is running
curl http://localhost:3001/health
```

**"Model unavailable"**
- ✅ Verify API keys in `.env`
- ✅ Check API key permissions
- ✅ Confirm internet connection

**Rate limit errors**
- ⏱️ Wait for rate limit reset
- 🔄 Switch to different model
- 📈 Check usage dashboard

### Debug Steps

1. **Backend Logs**: Check terminal running backend
2. **Browser Console**: Check for frontend errors  
3. **Network Tab**: Monitor API requests
4. **Health Check**: Visit `http://localhost:3001/health`

## 📝 Documentation

- 🚀 **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup
- 🤝 **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- 🔗 **API Reference** - Endpoint documentation above

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

**Quick contribution ideas:**
- 🤖 Add new AI models (Claude, Cohere, etc.)
- 🎨 Improve UI/UX design
- 📱 Enhance mobile experience
- 📝 Fix documentation typos
- 🐛 Report bugs

## 📄 License

**MIT License** - See [LICENSE](LICENSE) for details.

Feel free to use this project for learning, development, and production!

## 🔗 Useful Links

- 🤗 [Hugging Face Models](https://huggingface.co/models)
- 🔮 [Google AI Studio](https://makersuite.google.com/)
- 🧠 [OpenAI Documentation](https://platform.openai.com/docs)
- 🌟 [Mistral AI Docs](https://docs.mistral.ai/)
- ⚛️ [React Documentation](https://react.dev/)
- 🎨 [TailwindCSS](https://tailwindcss.com/)

---

<div align="center">

### 🎆 **Happy Chatting with AI!** 🎆

**Built with ❤️ by [Josh Robertson](https://github.com/joshrobertson8) using Perplexity AI**

If this project helps you, please give it a ⭐ on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/joshrobertson8/multi-ai-chat?style=social)](https://github.com/joshrobertson8/multi-ai-chat)

</div>