# 🚀 Complete Setup Guide for Multi-AI Chat

This guide will walk you through setting up the Multi-AI Chat application step by step.

## 📝 Prerequisites Checklist

- [ ] Node.js 18.0+ installed ([Download here](https://nodejs.org/))
- [ ] Git installed ([Download here](https://git-scm.com/))
- [ ] A code editor (VS Code recommended)
- [ ] At least one AI service account (see API Keys section)

## 💾 Installation Steps

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/joshrobertson8/multi-ai-chat.git
cd multi-ai-chat

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Environment Configuration

```bash
# Go to backend directory
cd ../backend

# Copy environment template
cp .env.example .env

# Edit the .env file with your API keys
nano .env  # or use your preferred editor
```

Your `.env` file should look like this:

```bash
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173

# AI API Keys (add at least one)
HUGGINGFACE_API_KEY=hf_your_actual_token_here
GEMINI_API_KEY=your_actual_gemini_key_here
OPENAI_API_KEY=sk-your_actual_openai_key_here
MISTRAL_API_KEY=your_actual_mistral_key_here
```

## 🔑 Getting Your API Keys

### 🤗 Hugging Face (Easiest to start with)

1. **Create Account**: Go to [huggingface.co](https://huggingface.co/) and sign up
2. **Navigate to Settings**: Click your profile → Settings → Access Tokens
3. **Create Token**: Click "New token"
   - Name: "Multi-AI Chat"
   - Type: "Read"
4. **Copy Token**: It will start with `hf_`
5. **Add to .env**: `HUGGINGFACE_API_KEY=hf_your_token_here`

**Free Tier**: 1,000 requests per day

### 🔮 Google Gemini (Most generous free tier)

1. **Go to AI Studio**: Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. **Sign in**: Use your Google account
3. **Create API Key**: Click "Create API Key"
4. **Copy Key**: Save it securely
5. **Add to .env**: `GEMINI_API_KEY=your_gemini_key_here`

**Free Tier**: 15 requests/minute, 1,500 requests/day

### 🧠 OpenAI (Most powerful)

1. **Create Account**: Go to [platform.openai.com](https://platform.openai.com/)
2. **Add Payment Method**: Required even for free credits
3. **Generate Key**: Go to API Keys → "Create new secret key"
4. **Copy Key**: It starts with `sk-`
5. **Add to .env**: `OPENAI_API_KEY=sk-your_key_here`

**Free Tier**: $5 credit for new users, then pay-per-use (~$0.0004/message)

### 🌟 Mistral AI

1. **Create Account**: Go to [console.mistral.ai](https://console.mistral.ai/)
2. **Verify Email**: Check your email and verify
3. **Generate Key**: Navigate to API Keys section
4. **Copy Key**: Save it securely
5. **Add to .env**: `MISTRAL_API_KEY=your_mistral_key_here`

**Free Tier**: Limited requests (varies)

## 🏃‍♂️ Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📡 CORS enabled for: http://localhost:5173
✅ Gemini client initialized
✅ OpenAI client initialized
🤖 Available AI models: ['gemini', 'openai']
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.2.0  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Open Browser

1. Navigate to `http://localhost:5173`
2. You should see the Multi-AI Chat interface
3. Check that the connection status shows "Connected"
4. Select a model from the dropdown
5. Send a test message!

## ⚙️ Troubleshooting

### Backend Issues

**"Server disconnected" in frontend**
```bash
# Check if backend is running
curl http://localhost:3001/health

# Should return JSON with available models
```

**"No models available"**
- Check your `.env` file has at least one valid API key
- Verify API keys are correct and have proper permissions
- Check the backend console for error messages

**Port 3001 already in use**
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process if needed
kill -9 <PID>

# Or change the port in backend/.env
PORT=3002
```

### Frontend Issues

**"Cannot connect to server"**
- Ensure backend is running on port 3001
- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend/.env (if you have one)

**Build errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues

**Hugging Face rate limits**
- Sign up for a free account to get 1,000 daily requests
- Pro account ($9/month) gives 10,000 daily requests

**OpenAI "Insufficient quota"**
- Add a payment method to your OpenAI account
- Check your usage at platform.openai.com
- New accounts get $5 free credit

**Gemini "API key not valid"**
- Ensure you're using the correct key from AI Studio
- Check if the key has the right permissions
- Try regenerating the key

## 🔍 Testing Your Setup

### 1. Backend Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "availableModels": ["gemini", "openai", "huggingface"],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Models Endpoint

```bash
curl http://localhost:3001/models
```

Expected response:
```json
[
  {
    "id": "gemini",
    "name": "Google Gemini 1.5 Flash",
    "available": true,
    "description": "Google's fast, versatile AI model"
  }
]
```

### 3. Chat Test

```bash
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "model": "gemini",
    "conversationHistory": []
  }'
```

### 4. Frontend Test

1. Open `http://localhost:5173`
2. Check connection status (should be "Connected")
3. Select a model from dropdown
4. Type "Hello" and press Enter
5. You should get a response from the AI model

## 🐛 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Backend not running | Start backend with `npm run dev` |
| `CORS error` | Frontend/backend URL mismatch | Check `CLIENT_URL` in `.env` |
| `Invalid API key` | Wrong or expired key | Double-check API key in `.env` |
| `Rate limit exceeded` | Too many requests | Wait or switch models |
| `Model unavailable` | API key not configured | Add the API key to `.env` |
| `Port already in use` | Port conflict | Change port or kill conflicting process |

## 🎆 Success!

If everything is working, you should see:

1. ✅ Backend running with available models listed
2. ✅ Frontend accessible at localhost:5173
3. ✅ "Connected" status in the app header
4. ✅ At least one model available in the dropdown
5. ✅ Successful chat responses from AI models

**You're now ready to chat with multiple AI models! 🎉**

---

Need help? Check the main [README.md](README.md) or open an issue on GitHub.