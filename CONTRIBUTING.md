# Contributing to Multi-AI Chat

We love contributions! This guide will help you get started.

## 🐛 Reporting Issues

**Before creating an issue:**
- Check if it already exists in [Issues](../../issues)
- Try the troubleshooting steps in [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Test with the latest version

**When reporting:**
- Use a clear, descriptive title
- Include steps to reproduce
- Add your environment details (Node.js version, OS, etc.)
- Include error messages and logs
- Add screenshots if helpful

## 🚀 Contributing Code

### Development Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/yourusername/multi-ai-chat.git
   cd multi-ai-chat
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   
   # Set up environment variables
   cp backend/.env.example backend/.env
   # Add your API keys
   ```

4. **Start development servers**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

### Code Style

- **Backend**: Follow Node.js best practices
- **Frontend**: Use TypeScript strict mode
- **Formatting**: We recommend Prettier
- **Linting**: ESLint configuration included

### Making Changes

1. **Keep commits focused** - One feature/fix per commit
2. **Write clear commit messages**
   ```
   feat: add Anthropic Claude support
   fix: resolve CORS issue in production
   docs: update API endpoint documentation
   ```
3. **Test your changes** - Ensure both frontend and backend work
4. **Update documentation** - If you add features, update the README

### Pull Request Process

1. **Update the README** if you add features
2. **Test thoroughly** with multiple AI models
3. **Create a pull request** with:
   - Clear title and description
   - Screenshots/GIFs if UI changes
   - Reference any related issues

## 🎆 Types of Contributions

### 🤖 Adding New AI Models

**Backend Steps:**
1. Add the new AI client to `backend/package.json`
2. Install and import in `server.js`
3. Create a handler function following the pattern
4. Add to the models list in `/models` endpoint
5. Update the `.env.example` with the new API key

**Frontend Steps:**
1. Add model badge color in `getModelBadgeColor()`
2. Test the new model in the dropdown

**Documentation:**
1. Add setup instructions to README
2. Update the API keys section
3. Add rate limit information

### 🎨 UI/UX Improvements

- Follow the existing TailwindCSS patterns
- Ensure mobile responsiveness
- Test with different screen sizes
- Consider accessibility (ARIA labels, keyboard navigation)

### 🔧 Backend Enhancements

- Maintain the existing API contract
- Add comprehensive error handling
- Include logging for debugging
- Follow security best practices

### 📝 Documentation

- Keep README up to date
- Add inline code comments
- Update setup guides
- Include troubleshooting steps

## 📝 Development Guidelines

### API Design

- Keep endpoints RESTful
- Use consistent error responses
- Include proper HTTP status codes
- Validate input parameters

### Error Handling

```javascript
// Good: Descriptive error messages
try {
  const response = await aiModel.chat(message);
  return response;
} catch (error) {
  throw new Error(`${modelName} API error: ${error.message}`);
}
```

### Environment Variables

- Add new variables to `.env.example`
- Document in README
- Use descriptive variable names
- Provide default values where possible

### Frontend State Management

- Use React hooks consistently
- Keep state updates immutable
- Handle loading states properly
- Show user feedback for actions

## 🧪 Testing

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] All configured models work
- [ ] Error handling works (invalid API keys, rate limits)
- [ ] Chat history persists in localStorage
- [ ] Model switching works mid-conversation
- [ ] Responsive design on mobile
- [ ] Fallback system works when models fail

### Testing New Models

1. Test with valid API key
2. Test with invalid/missing API key
3. Test rate limiting behavior
4. Test with long conversations
5. Test fallback to other models

## 🔒 Security Considerations

- Never commit API keys
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting on server
- Sanitize error messages (don't expose API keys)

## 🌐 Internationalization

Interested in adding language support?
- Use React i18n libraries
- Externalize all user-facing strings
- Consider RTL language support
- Test with various character sets

## 💬 Questions?

- Open a [Discussion](../../discussions) for general questions
- Create an [Issue](../../issues) for bugs
- Check existing documentation first

## 🚀 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments

Thanks for contributing to Multi-AI Chat! 🙏