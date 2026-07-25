# 🎤 HealthLock Voice Assistant

## Overview

An intelligent, bilingual medical voice assistant powered by Google Gemini AI with automatic fallback to local responses.

## ✨ Features

### Core Capabilities
- 🎙️ **Voice Input**: Speak your questions naturally
- 🔊 **Voice Output**: Hear responses read aloud
- 🌐 **Bilingual**: Full support for English and Hindi
- 🤖 **AI-Powered**: Optional Google Gemini AI integration
- 📱 **Responsive**: Works on desktop and mobile
- ⚡ **Fast**: Instant local responses, 1-2s AI responses

### Medical Knowledge
- 💊 **Medications**: Dosages, side effects, interactions
- 🩺 **Symptoms**: Guidance and when to seek help
- 📅 **Appointments**: Booking and scheduling help
- 🏥 **Hospital Services**: Departments, doctors, facilities
- 🚨 **Emergency**: Quick access to emergency information

## 🚀 Quick Start

### For Users

1. **Open Voice Assistant**
   - Click the voice assistant button in the app
   - Or use the floating button in bottom-right corner

2. **Choose Your Language**
   - Click the language toggle (🌐) to switch between English and Hindi
   - Voice recognition adapts automatically

3. **Start Talking**
   - Click "Start Voice" button
   - Speak your question clearly
   - Wait for the response

4. **Quick Actions**
   - Use quick action buttons for common queries
   - "Medication Info", "Book Appointment", "Symptom Check", "Emergency"

### For Developers

1. **Enable AI (Optional)**
   ```bash
   # Get free API key from: https://makersuite.google.com/app/apikey
   # Add to server/.env:
   GEMINI_API_KEY=your_key_here
   ```

2. **Start Server**
   ```bash
   npm run server
   ```

3. **Check Status**
   - Look for: `✅ Google Gemini AI initialized successfully`
   - Or: `⚠️ Voice assistant will use local responses only`

## 💡 Example Queries

### Medication Questions
```
English:
- "Tell me about paracetamol"
- "What's the dosage for ibuprofen?"
- "Side effects of aspirin?"

Hindi:
- "पैरासिटामोल के बारे में बताएं"
- "आइबुप्रोफेन की खुराक क्या है?"
- "एस्पिरिन के दुष्प्रभाव?"
```

### Symptom Guidance
```
English:
- "I have a fever and headache"
- "What should I do for chest pain?"
- "When should I see a doctor?"

Hindi:
- "मुझे बुखार और सिरदर्द है"
- "सीने में दर्द के लिए क्या करूं?"
- "मुझे डॉक्टर से कब मिलना चाहिए?"
```

### Hospital Services
```
English:
- "How do I book an appointment?"
- "What departments do you have?"
- "Are there cardiologists available?"

Hindi:
- "अपॉइंटमेंट कैसे बुक करें?"
- "आपके पास कौन से विभाग हैं?"
- "क्या हृदय रोग विशेषज्ञ उपलब्ध हैं?"
```

## 🎯 Two Modes

### Local Mode (Default)
- ✅ Works immediately, no setup
- ✅ Fast, reliable, offline-capable
- ✅ Comprehensive medical knowledge base
- ✅ Bilingual support
- ⚠️ Pre-programmed responses

### AI Mode (Optional)
- ✨ Natural, conversational responses
- ✨ Context-aware and adaptive
- ✨ Better understanding of complex queries
- ✨ Continuously improving
- ⚠️ Requires API key and internet

**Both modes are fully functional!** AI is an enhancement, not a requirement.

## 🔧 Configuration

### Enable/Disable Voice Output
- Click the speaker icon (🔊) in the assistant
- Toggle between voice output on/off

### Switch Languages
- Click the language icon (🌐)
- Switches between English and Hindi
- Voice recognition adapts automatically

### Minimize/Maximize
- Click minimize icon to collapse assistant
- Click maximize to expand again
- Close button to hide completely

## 📱 Browser Support

### Voice Recognition
- ✅ Chrome/Edge (Best support)
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (Limited)
- ❌ Internet Explorer (Not supported)

### Voice Synthesis
- ✅ All modern browsers
- ✅ Mobile devices
- ✅ Multiple languages

## 🆘 Troubleshooting

### Voice Recognition Not Working
1. Check browser permissions for microphone
2. Ensure you're using HTTPS (required for mic access)
3. Try Chrome/Edge for best compatibility
4. Check microphone is not muted

### No Voice Output
1. Check device volume
2. Click speaker icon to enable voice
3. Check browser audio permissions
4. Try different browser

### AI Not Working
1. Check server console for AI status
2. Verify API key in `.env` file
3. Check internet connection
4. System automatically falls back to local responses

### Responses in Wrong Language
1. Click language toggle icon
2. Verify language setting matches your query
3. Try speaking more clearly
4. Use quick action buttons

## 📚 Documentation

- **Setup Guide**: `GEMINI_AI_SETUP_GUIDE.md` - Complete AI setup
- **Quick Start**: `AI_QUICK_START.md` - 5-minute AI setup
- **Implementation**: `VOICE_ASSISTANT_AI_INTEGRATION.md` - Technical details
- **This File**: `VOICE_ASSISTANT_README.md` - User guide

## 🔒 Privacy & Security

- Voice data is processed locally in browser
- Queries sent to server for processing
- AI queries sent to Google Gemini (if enabled)
- No voice recordings are stored
- All data encrypted in transit

## 📞 Contact Information

**Emergency Services**
- Emergency: (555) 911-HELP or 102/108
- Appointments: (555) 123-CARE
- 24/7 Support Available

## 🎉 Tips for Best Experience

1. **Speak Clearly**: Enunciate words for better recognition
2. **Use Quick Actions**: Faster than voice for common queries
3. **Try Both Languages**: Switch based on comfort
4. **Enable Voice Output**: Better for hands-free use
5. **Check AI Badge**: Green "✨ AI" means AI is active

## 🌟 Coming Soon

- 📸 Image analysis (X-rays, reports)
- 📊 Health tracking integration
- 🔔 Medication reminders
- 👥 Multi-user support
- 📱 Mobile app version

---

**Need Help?** Check the documentation files or contact support at (555) 123-CARE
