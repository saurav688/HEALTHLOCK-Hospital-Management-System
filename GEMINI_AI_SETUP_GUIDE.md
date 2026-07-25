# 🤖 Google Gemini AI Integration Guide

## Overview

Your HealthLock voice assistant now supports **Google Gemini AI** for intelligent, context-aware medical responses! The system works in two modes:

1. **AI Mode** (with Gemini API key): Intelligent, natural responses powered by Google's Gemini AI
2. **Local Mode** (without API key): Pre-programmed responses from local database

## ✨ Features

- **Intelligent Medical Responses**: Natural language understanding for medical queries
- **Bilingual Support**: Works in both English and Hindi
- **Context-Aware**: Uses hospital statistics and patient data for relevant answers
- **Automatic Fallback**: Seamlessly falls back to local responses if AI is unavailable
- **Free Tier Available**: Google offers generous free tier for Gemini API

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Free Gemini API Key

1. Visit **Google AI Studio**: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Add API Key to Your Project

1. Open `server/.env` file
2. Find the line: `# GEMINI_API_KEY=your_api_key_here`
3. Uncomment and replace with your key:
   ```env
   GEMINI_API_KEY=AIzaSyD...your_actual_key_here
   ```
4. Save the file

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run server
```

You should see:
```
✅ Google Gemini AI initialized successfully
```

## 🎯 How It Works

### With AI Enabled

```
User: "Tell me about paracetamol side effects"
↓
Gemini AI generates intelligent, contextual response
↓
Natural, conversational answer with medical accuracy
```

### Without AI (Fallback)

```
User: "Tell me about paracetamol side effects"
↓
Local medication database lookup
↓
Pre-programmed response from knowledge base
```

## 📊 Testing Your Setup

### Test 1: Check AI Status

```bash
curl http://localhost:5000/api/medical-assistant/ai-status
```

**Expected Response (AI Enabled):**
```json
{
  "available": true,
  "model": "gemini-pro",
  "provider": "Google Gemini"
}
```

**Expected Response (AI Disabled):**
```json
{
  "available": false,
  "model": null,
  "provider": "Google Gemini"
}
```

### Test 2: Try a Query

Open the voice assistant in your app and ask:
- "What are the side effects of ibuprofen?"
- "I have a headache, what should I do?"
- "मुझे बुखार है, क्या करूं?" (Hindi)

With AI enabled, you'll get more natural, detailed responses!

## 💡 Example Queries

### Medication Questions
- "Tell me about paracetamol"
- "What's the dosage for ibuprofen?"
- "Can I take aspirin with other medications?"
- "पैरासिटामोल के दुष्प्रभाव क्या हैं?" (Hindi)

### Symptom Guidance
- "I have a fever and headache"
- "What should I do for chest pain?"
- "When should I see a doctor for a cough?"
- "मुझे सिरदर्द है" (Hindi)

### Hospital Services
- "How do I book an appointment?"
- "What departments do you have?"
- "Are there any cardiologists available?"
- "अपॉइंटमेंट कैसे बुक करें?" (Hindi)

## 🔧 Troubleshooting

### Issue: "GEMINI_API_KEY not found"

**Solution:**
1. Check `server/.env` file exists
2. Verify the line is uncommented (no `#` at start)
3. Ensure no extra spaces around the `=` sign
4. Restart the server

### Issue: "Invalid API key"

**Solution:**
1. Verify you copied the complete key (starts with `AIza`)
2. Check for extra spaces or line breaks
3. Generate a new key from Google AI Studio
4. Make sure you're using the correct Google account

### Issue: "API quota exceeded"

**Solution:**
- Google's free tier is generous but has limits
- Wait for quota reset (usually daily)
- Consider upgrading to paid tier for production use
- System automatically falls back to local responses

### Issue: AI responses not appearing

**Solution:**
1. Check server console for initialization message
2. Test the `/api/medical-assistant/ai-status` endpoint
3. Look for error messages in server logs
4. Verify internet connection (AI requires online access)

## 📈 API Limits (Free Tier)

Google Gemini Free Tier includes:
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

This is more than enough for development and small-scale production!

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - `.env` file is already in `.gitignore`
   - Use environment variables in production

2. **Rotate keys regularly**
   - Generate new keys every few months
   - Revoke old keys in Google AI Studio

3. **Monitor usage**
   - Check Google AI Studio dashboard
   - Set up usage alerts

4. **Use different keys for dev/prod**
   - Development key for testing
   - Production key for live system

## 🌟 Benefits of AI Integration

### Before (Local Responses)
- ✅ Fast and reliable
- ✅ Works offline
- ❌ Limited to pre-programmed responses
- ❌ Can't understand complex queries
- ❌ No learning or adaptation

### After (AI-Powered)
- ✅ Natural language understanding
- ✅ Context-aware responses
- ✅ Handles complex medical queries
- ✅ Bilingual support (English & Hindi)
- ✅ Continuously improving
- ✅ Automatic fallback to local responses

## 🎓 Advanced Configuration

### Custom System Prompts

Edit `server/src/utils/geminiService.js` to customize AI behavior:

```javascript
const getSystemPrompt = (language = 'en') => {
  // Customize your AI assistant's personality and guidelines here
  return `You are a helpful medical AI assistant...`;
};
```

### Adjust Response Length

In `geminiService.js`, modify the prompt:

```javascript
// For shorter responses
const fullPrompt = `${systemPrompt}...
Keep the response concise (under 150 words)...`;

// For longer, detailed responses
const fullPrompt = `${systemPrompt}...
Provide a comprehensive response (300-500 words)...`;
```

### Add Context Data

Pass additional context to AI:

```javascript
const aiResponse = await generateAIResponse(query, language, {
  hospitalStats,
  patientHistory: patientData,
  recentAppointments: appointments
});
```

## 📚 Resources

- **Google AI Studio**: https://makersuite.google.com/
- **Gemini API Documentation**: https://ai.google.dev/docs
- **Pricing Information**: https://ai.google.dev/pricing
- **API Key Management**: https://makersuite.google.com/app/apikey

## 🆘 Support

If you encounter issues:

1. Check server console logs for error messages
2. Verify API key is correct and active
3. Test with simple queries first
4. Check Google AI Studio dashboard for quota/errors
5. System will automatically use local responses as fallback

## 🎉 Success Indicators

You'll know AI is working when:

1. Server startup shows: `✅ Google Gemini AI initialized successfully`
2. Voice assistant responses are more natural and conversational
3. Complex queries get intelligent, context-aware answers
4. Responses adapt to conversation context
5. Both English and Hindi queries work seamlessly

---

**Note**: The voice assistant works perfectly without AI (using local responses). AI integration enhances the experience but is completely optional!
