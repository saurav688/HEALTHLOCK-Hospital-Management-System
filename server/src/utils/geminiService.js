import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
let genAI = null;
let model = null;

// Initialize the AI model
export const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️  GEMINI_API_KEY not found in environment variables.");
    console.warn("   Voice assistant will use local responses only.");
    console.warn("   To enable AI: Add GEMINI_API_KEY to server/.env file");
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("✅ Google Gemini AI initialized successfully");
    console.log(`   API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    return true;
  } catch (error) {
    console.error("❌ Error initializing Gemini AI:", error.message);
    return false;
  }
};

// Medical assistant system prompt
const getSystemPrompt = (language = 'en') => {
  if (language === 'hi') {
    return `आप HealthLock अस्पताल के लिए एक सहायक चिकित्सा AI सहायक हैं। आपकी भूमिका:

1. **दवा की जानकारी**: सामान्य दवाओं, खुराक, दुष्प्रभाव और चेतावनियों के बारे में सटीक जानकारी प्रदान करें
2. **लक्षण मार्गदर्शन**: सामान्य लक्षणों के लिए सहायक सलाह दें और कब चिकित्सा सहायता लेनी है
3. **अपॉइंटमेंट सहायता**: अपॉइंटमेंट बुकिंग, रद्द करने और पुनर्निर्धारण में मदद करें
4. **अस्पताल सेवाएं**: विभागों, डॉक्टरों और सुविधाओं के बारे में जानकारी प्रदान करें
5. **आपातकालीन मार्गदर्शन**: आपातकालीन स्थितियों को पहचानें और तत्काल कार्रवाई की सलाह दें

महत्वपूर्ण दिशानिर्देश:
- हमेशा स्पष्ट, सहानुभूतिपूर्ण और पेशेवर रहें
- चिकित्सा अस्वीकरण शामिल करें जब उपयुक्त हो
- गंभीर लक्षणों के लिए पेशेवर चिकित्सा सलाह लेने की सलाह दें
- संक्षिप्त लेकिन व्यापक उत्तर प्रदान करें
- हिंदी में स्वाभाविक रूप से उत्तर दें

संपर्क जानकारी:
- अपॉइंटमेंट: (555) 123-CARE
- आपातकाल: (555) 911-HELP या 102/108`;
  }

  return `You are a helpful medical AI assistant for HealthLock Hospital. Your role is to:

1. **Medication Information**: Provide accurate information about common medications, dosages, side effects, and warnings
2. **Symptom Guidance**: Offer supportive advice for common symptoms and when to seek medical help
3. **Appointment Assistance**: Help with appointment booking, cancellation, and rescheduling
4. **Hospital Services**: Provide information about departments, doctors, and facilities
5. **Emergency Guidance**: Recognize emergency situations and advise immediate action

Important Guidelines:
- Always be clear, empathetic, and professional
- Include medical disclaimers when appropriate
- Advise seeking professional medical care for serious symptoms
- Provide concise but comprehensive answers
- Use formatting (bullet points, sections) for readability

Contact Information:
- Appointments: (555) 123-CARE
- Emergency: (555) 911-HELP or 911`;
};

// Generate AI response
export const generateAIResponse = async (userQuery, language = 'en', context = {}) => {
  // Check if AI is initialized
  if (!model) {
    console.log("⚠️  AI not available, using local responses");
    return null; // Return null to fall back to local responses
  }

  try {
    const systemPrompt = getSystemPrompt(language);
    
    // Build context information
    let contextInfo = '';
    if (context.hospitalStats) {
      contextInfo += `\n\nHospital Statistics:
- Active Doctors: ${context.hospitalStats.doctors}
- Available Rooms: ${context.hospitalStats.availableRooms}
- Departments: ${context.hospitalStats.departments}
- Current Admissions: ${context.hospitalStats.currentAdmissions}`;
    }

    // Combine system prompt, context, and user query
    const fullPrompt = `${systemPrompt}${contextInfo}

User Query: ${userQuery}

Please provide a helpful, accurate, and empathetic response in ${language === 'hi' ? 'Hindi' : 'English'}. Keep the response concise (under 300 words) but informative.`;

    console.log(`🤖 Generating AI response for: "${userQuery.substring(0, 50)}..."`);
    
    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log(`✅ AI response generated successfully (${text.length} chars)`);
    return text;
  } catch (error) {
    console.error("❌ Error generating AI response:", error.message);
    
    // Check for specific error types
    if (error.message?.includes('API key')) {
      console.error("   Invalid or expired Gemini API key");
    } else if (error.message?.includes('quota')) {
      console.error("   Gemini API quota exceeded");
    } else if (error.message?.includes('SAFETY')) {
      console.error("   Content filtered by safety settings");
    }
    
    return null; // Fall back to local responses
  }
};

// Check if AI is available
export const isAIAvailable = () => {
  return model !== null;
};

// Get AI status
export const getAIStatus = () => {
  return {
    available: isAIAvailable(),
    model: model ? "gemini-pro" : null,
    provider: "Google Gemini"
  };
};
