import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  X,
  Minimize2,
  Maximize2,
  Stethoscope,
  Calendar,
  Pill,
  Phone,
  Languages,
  Globe
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistant = ({ isOpen, onClose }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your medical assistant. I can help you with medication information, doctor appointments, hospital services, and answer your health-related questions. How can I assist you today?\n\nनमस्ते! मैं आपका चिकित्सा सहायक हूं। मैं दवाओं की जानकारी, डॉक्टर की अपॉइंटमेंट, अस्पताल की सेवाओं और स्वास्थ्य संबंधी प्रश्नों में आपकी सहायता कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?',
      timestamp: new Date()
    }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        const errorMsg = language === 'hi' 
          ? 'वाक् पहचान में त्रुटि। कृपया पुनः प्रयास करें।'
          : 'Speech recognition error. Please try again.';
        toast.error(errorMsg);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Check AI status
    fetch(`${API_BASE}/medical-assistant/ai-status`)
      .then(res => res.json())
      .then(data => setAiEnabled(data.available))
      .catch(() => setAiEnabled(false));

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [language]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthesisRef.current && speechEnabled) {
      synthesisRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Set language for speech synthesis
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesisRef.current.speak(utterance);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    
    // Update speech recognition language
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang === 'hi' ? 'hi-IN' : 'en-US';
    }
    
    const message = newLang === 'hi' 
      ? 'भाषा हिंदी में बदल दी गई है। अब आप हिंदी में बात कर सकते हैं।'
      : 'Language switched to English. You can now speak in English.';
    
    toast.success(message);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleUserMessage = async (content: string) => {
    console.log('User message received:', content); // Debug log
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await processUserQuery(content);
      console.log('AI response generated:', response.substring(0, 100) + '...'); // Debug log
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      if (speechEnabled) {
        speak(response);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserQuery = async (query: string): Promise<string> => {
    console.log('Processing query:', query); // Debug log
    
    try {
      // Use the enhanced backend API for intelligent responses
      const response = await fetch(`${API_BASE}/medical-assistant/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, language }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer && data.answer.trim() !== '') {
          return data.answer;
        }
      }
    } catch (error) {
      console.error('Error calling backend AI:', error);
    }

    // Enhanced local processing with better pattern matching
    const lowerQuery = query.toLowerCase().trim();
    console.log('Processing locally:', lowerQuery); // Debug log

    // Detect language and process accordingly
    const isHindi = language === 'hi' || containsHindi(query);
    
    if (isHindi) {
      return await processHindiQuery(lowerQuery);
    } else {
      return await processEnglishQuery(lowerQuery);
    }
  };

  const containsHindi = (text: string): boolean => {
    // Check if text contains Devanagari script (Hindi)
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(text);
  };

  const processHindiQuery = async (query: string): Promise<string> => {
    // Hindi medication names and keywords
    const hindiMedications = ['पैरासिटामोल', 'आइबुप्रोफेन', 'एस्पिरिन', 'एमोक्सिसिलिन', 'मेटफॉर्मिन'];
    const hindiKeywords = {
      medicine: ['दवा', 'दवाई', 'औषधि', 'मेडिसिन'],
      appointment: ['अपॉइंटमेंट', 'मुलाकात', 'समय'],
      doctor: ['डॉक्टर', 'चिकित्सक', 'वैद्य'],
      fever: ['बुखार', 'ज्वर'],
      pain: ['दर्द', 'पीड़ा'],
      headache: ['सिरदर्द', 'सिर में दर्द'],
      emergency: ['आपातकाल', 'इमरजेंसी', 'तुरंत'],
      help: ['मदद', 'सहायता']
    };

    // Check for specific Hindi medication queries
    for (const med of hindiMedications) {
      if (query.includes(med)) {
        return getHindiMedicationInfo(med);
      }
    }

    // Check for general medication queries in Hindi
    if (hindiKeywords.medicine.some(word => query.includes(word))) {
      return `💊 **दवा की जानकारी सेवा**

मैं सामान्य दवाओं के बारे में जानकारी दे सकता हूं:

🔹 **दर्द निवारक:** पैरासिटामोल, आइबुप्रोफेन, एस्पिरिन
🔹 **एंटीबायोटिक्स:** एमोक्सिसिलिन, पेनिसिलिन
🔹 **मधुमेह की दवा:** मेटफॉर्मिन, इंसुलिन

**मुझसे पूछें:**
• दवा की खुराक और सेवन विधि
• सामान्य दुष्प्रभाव और चेतावनी
• दवाओं के बीच परस्पर क्रिया
• कब चिकित्सा सहायता लें

आप किस दवा के बारे में जानना चाहते हैं?`;
    }

    // Check for appointment queries in Hindi
    if (hindiKeywords.appointment.some(word => query.includes(word))) {
      return `📅 **अपॉइंटमेंट सेवाएं**

**अपॉइंटमेंट बुक करने के लिए:**
📞 **कॉल करें:** (555) 123-CARE (24/7)
🏥 **आएं:** मुख्य रिसेप्शन डेस्क पर
💻 **ऑनलाइन:** पेशेंट पोर्टल (जल्द आ रहा है)

**उपलब्ध सेवाएं:**
• नई अपॉइंटमेंट बुक करना
• मौजूदा अपॉइंटमेंट रद्द करना
• अपॉइंटमेंट का समय बदलना
• विशेषज्ञ डॉक्टर खोजना

आज मैं आपकी अपॉइंटमेंट में कैसे मदद कर सकता हूं?`;
    }

    // Check for doctor queries in Hindi
    if (hindiKeywords.doctor.some(word => query.includes(word))) {
      return `👨‍⚕️ **डॉक्टर की जानकारी**

**उपलब्ध विशेषज्ञता:**
🔹 हृदय रोग विशेषज्ञ (कार्डियोलॉजिस्ट)
🔹 न्यूरोलॉजिस्ट (मस्तिष्क विशेषज्ञ)
🔹 हड्डी रोग विशेषज्ञ (ऑर्थोपेडिक)
🔹 बाल रोग विशेषज्ञ (पीडियाट्रिशियन)
🔹 आपातकालीन चिकित्सा

**अपॉइंटमेंट के लिए कॉल करें:** (555) 123-CARE

आपको किस प्रकार के डॉक्टर की आवश्यकता है?`;
    }

    // Check for fever queries in Hindi
    if (hindiKeywords.fever.some(word => query.includes(word))) {
      return `🌡️ **बुखार का इलाज:**

**तुरंत देखभाल:**
• आराम करें और तरल पदार्थ पिएं
• पैरासिटामोल या आइबुप्रोफेन लें
• माथे पर ठंडी पट्टी रखें
• हल्के कपड़े पहनें

**डॉक्टर से मिलें यदि:**
• तापमान 103°F (39.4°C) से अधिक हो
• बुखार 3 दिन से अधिक रहे
• सांस लेने में कठिनाई या सीने में दर्द
• तेज सिरदर्द या गर्दन में अकड़न

यह सामान्य सलाह है। उचित निदान के लिए डॉक्टर से सलाह लें।`;
    }

    // Check for pain queries in Hindi
    if (hindiKeywords.pain.some(word => query.includes(word))) {
      return `😣 **दर्द का इलाज:**

**सामान्य दर्द निवारण:**
• प्रभावित हिस्से को आराम दें
• बर्फ (पहले 24-48 घंटे) या गर्मी लगाएं
• डॉक्टर की सलाह पर दर्द निवारक दवा लें
• हल्की स्ट्रेचिंग या हरकत करें

**डॉक्टर से मिलें यदि:**
• तेज या बढ़ता हुआ दर्द
• चोट के बाद दर्द
• सुन्नता या झुनझुनी के साथ दर्द
• संक्रमण के लक्षण (लालिमा, गर्मी, सूजन)

उचित जांच और इलाज के लिए डॉक्टर से सलाह लें।`;
    }

    // Check for emergency queries in Hindi
    if (hindiKeywords.emergency.some(word => query.includes(word))) {
      return `🚨 **आपातकालीन सेवाएं** 🚨

**तुरंत चिकित्सा आपातकाल के लिए:**
• 102 या 108 पर कॉल करें
• हमारा आपातकालीन विभाग 24/7 खुला है
• स्थान: भूतल, मुख्य भवन
• आपातकालीन हॉटलाइन: (555) 911-HELP

**गैर-आपातकालीन तत्काल देखभाल के लिए:** (555) 123-CARE पर कॉल करें।`;
    }

    // Greeting in Hindi
    if (query.includes('नमस्ते') || query.includes('हैलो') || query.includes('प्रणाम')) {
      return `नमस्ते! मैं आपका चिकित्सा सहायक हूं। मैं दवाओं की जानकारी, डॉक्टर की अपॉइंटमेंट, अस्पताल की सेवाओं और स्वास्थ्य संबंधी प्रश्नों में आपकी सहायता कर सकता हूं। आप क्या जानना चाहते हैं?`;
    }

    // Thank you in Hindi
    if (query.includes('धन्यवाद') || query.includes('शुक्रिया')) {
      return `आपका स्वागत है! मैं यहां किसी भी चिकित्सा प्रश्न या अस्पताल सेवाओं में आपकी सहायता के लिए हूं। क्या कोई और चीज है जिसमें मैं आपकी मदद कर सकता हूं?`;
    }

    // Default Hindi response
    return `मैं आपकी इन चीजों में सहायता कर सकता हूं:

• दवाओं की जानकारी (खुराक, दुष्प्रभाव, परस्पर क्रिया)
• डॉक्टर की अपॉइंटमेंट और समय निर्धारण
• अस्पताल की सेवाएं और विभाग
• लक्षणों की जानकारी और स्वास्थ्य सलाह
• आपातकालीन संपर्क जानकारी

कुछ इस तरह पूछें:
- "पैरासिटामोल के बारे में बताएं"
- "हृदय रोग विशेषज्ञ से अपॉइंटमेंट बुक करें"
- "मुझे सिरदर्द है, क्या करूं?"
- "आपकी आपातकालीन सेवाएं क्या हैं?"

आप क्या जानना चाहते हैं?`;
  };

  const processEnglishQuery = async (query: string): Promise<string> => {
    // Specific medication queries - check for exact medication names first
    const medications = ['paracetamol', 'acetaminophen', 'ibuprofen', 'aspirin', 'amoxicillin', 'metformin', 'insulin', 'omeprazole', 'lisinopril', 'atorvastatin'];
    for (const med of medications) {
      if (query.includes(med)) {
        console.log('Found medication:', med); // Debug log
        return await handleMedicationQuery(query);
      }
    }

    // General medication-related queries
    if (query.includes('medicine') || query.includes('medication') || 
        query.includes('drug') || query.includes('pill') || 
        query.includes('tablet') || query.includes('capsule') ||
        query.includes('dosage') || query.includes('side effect')) {
      return await handleMedicationQuery(query);
    }

    // Appointment-related queries
    if (query.includes('appointment') || query.includes('schedule') || 
        query.includes('book') || query.includes('reserve') ||
        query.includes('cancel') || query.includes('reschedule')) {
      return await handleAppointmentQuery(query);
    }

    // Doctor-related queries
    if (query.includes('doctor') || query.includes('physician') || 
        query.includes('specialist') || query.includes('cardiology') ||
        query.includes('neurology') || query.includes('orthopedic') ||
        query.includes('pediatric') || query.includes('cardiologist') ||
        query.includes('neurologist') || query.includes('pediatrician')) {
      return await handleDoctorQuery(query);
    }

    // Department/service queries
    if (query.includes('department') || query.includes('service') || 
        query.includes('ward') || query.includes('unit')) {
      return await handleDepartmentQuery(query);
    }

    // Room/bed queries
    if (query.includes('room') || query.includes('bed') || 
        query.includes('admission') || query.includes('available')) {
      return await handleRoomQuery(query);
    }

    // Emergency queries
    if (query.includes('emergency') || query.includes('urgent') || 
        query.includes('help') || query.includes('911') ||
        query.includes('ambulance')) {
      return handleEmergencyQuery(query);
    }

    // Health/symptom queries
    if (query.includes('symptom') || query.includes('pain') || 
        query.includes('fever') || query.includes('headache') ||
        query.includes('cough') || query.includes('cold') ||
        query.includes('flu') || query.includes('sick') ||
        query.includes('hurt') || query.includes('ache')) {
      return handleHealthQuery(query);
    }

    // Greeting queries
    if (query.includes('hello') || query.includes('hi') || 
        query.includes('hey') || query.includes('good morning') ||
        query.includes('good afternoon') || query.includes('good evening')) {
      return "Hello! I'm your medical assistant. I can help you with medication information, doctor appointments, hospital services, and health-related questions. What would you like to know?";
    }

    // Thank you queries
    if (query.includes('thank') || query.includes('thanks')) {
      return "You're welcome! I'm here to help with any medical questions or hospital services you need. Is there anything else I can assist you with?";
    }

    // Default response with suggestions
    return `I can help you with:

• Medication information (dosages, side effects, interactions)
• Doctor appointments and scheduling
• Hospital services and departments
• Symptom guidance and health advice
• Emergency contact information

Try asking me something like:
- "Tell me about paracetamol"
- "Book an appointment with a cardiologist"
- "I have a headache, what should I do?"
- "What are your emergency services?"

What would you like to know?`;
  };

  const getHindiMedicationInfo = (medication: string): string => {
    const hindiMedInfo: { [key: string]: any } = {
      'पैरासिटामोल': {
        name: 'पैरासिटामोल (एसिटामिनोफेन)',
        uses: 'दर्द निवारण और बुखार कम करना',
        dosage: 'वयस्क: 500mg-1g हर 4-6 घंटे में, अधिकतम 4g प्रति दिन। बच्चे: 10-15mg/kg हर 4-6 घंटे में।',
        sideEffects: 'आमतौर पर सुरक्षित। दुर्लभ: अधिक मात्रा से लीवर को नुकसान, त्वचा पर चकत्ते।',
        warnings: 'शराब से बचें। अधिकतम खुराक न बढ़ाएं। अन्य दवाओं में पैरासिटामोल की जांच करें।'
      }
    };

    const medData = hindiMedInfo[medication];
    if (medData) {
      return `📋 **${medData.name}**

🎯 **उपयोग:** ${medData.uses}

💊 **खुराक:** ${medData.dosage}

⚠️ **सामान्य दुष्प्रभाव:** ${medData.sideEffects}

🚨 **महत्वपूर्ण चेतावनी:** ${medData.warnings}

⚕️ **चिकित्सा अस्वीकरण:** यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। व्यक्तिगत चिकित्सा सलाह, उचित निदान और उपचार की सिफारिशों के लिए हमेशा अपने डॉक्टर या फार्मासिस्ट से सलाह लें।`;
    }

    return `मुझे इस दवा की जानकारी नहीं है। कृपया अपने डॉक्टर या फार्मासिस्ट से सलाह लें।`;
  };

  const handleMedicationQuery = async (query: string): Promise<string> => {
    console.log('Handling medication query:', query); // Debug log
    
    // Comprehensive medication database
    const medicationInfo = {
      'paracetamol': {
        name: 'Paracetamol (Acetaminophen)',
        uses: 'Pain relief and fever reduction',
        dosage: 'Adults: 500mg-1g every 4-6 hours, maximum 4g per day. Children: 10-15mg/kg every 4-6 hours.',
        sideEffects: 'Generally well tolerated. Rare: liver damage with overdose, skin rash.',
        warnings: 'Avoid alcohol while taking. Do not exceed maximum dose. Check other medications for paracetamol content.',
        interactions: 'Warfarin (blood thinner), chronic alcohol use'
      },
      'acetaminophen': {
        name: 'Acetaminophen (Paracetamol)',
        uses: 'Pain relief and fever reduction',
        dosage: 'Adults: 500mg-1g every 4-6 hours, maximum 4g per day. Children: 10-15mg/kg every 4-6 hours.',
        sideEffects: 'Generally well tolerated. Rare: liver damage with overdose, skin rash.',
        warnings: 'Avoid alcohol while taking. Do not exceed maximum dose. Check other medications for paracetamol content.',
        interactions: 'Warfarin (blood thinner), chronic alcohol use'
      },
      'ibuprofen': {
        name: 'Ibuprofen',
        uses: 'Pain relief, inflammation reduction, and fever reduction',
        dosage: 'Adults: 200-400mg every 4-6 hours with food, maximum 1200mg per day. Children: 5-10mg/kg every 6-8 hours.',
        sideEffects: 'Stomach upset, heartburn, dizziness, headache, increased blood pressure.',
        warnings: 'Take with food. Avoid if allergic to aspirin. May increase cardiovascular risk with long-term use.',
        interactions: 'Blood thinners, ACE inhibitors, diuretics, lithium'
      },
      'aspirin': {
        name: 'Aspirin',
        uses: 'Pain relief, blood clot prevention, heart attack prevention, fever reduction',
        dosage: 'Pain relief: 300-600mg every 4 hours. Heart protection: 75-100mg daily. Take with food.',
        sideEffects: 'Stomach irritation, bleeding risk, tinnitus (ringing in ears), allergic reactions.',
        warnings: 'Not for children under 16 (Reye\'s syndrome risk). Bleeding risk. Take with food.',
        interactions: 'Warfarin, methotrexate, alcohol, other NSAIDs'
      },
      'amoxicillin': {
        name: 'Amoxicillin',
        uses: 'Bacterial infections (respiratory, urinary tract, skin infections)',
        dosage: 'Adults: 250-500mg every 8 hours or 500-875mg every 12 hours. Complete full course.',
        sideEffects: 'Nausea, diarrhea, skin rash, allergic reactions, thrush.',
        warnings: 'Complete full course even if feeling better. Allergic to penicillin. May reduce contraceptive effectiveness.',
        interactions: 'Oral contraceptives, methotrexate, allopurinol'
      },
      'metformin': {
        name: 'Metformin',
        uses: 'Type 2 diabetes management, PCOS treatment',
        dosage: 'Starting: 500mg twice daily with meals. Maximum: 2000-2500mg daily in divided doses.',
        sideEffects: 'Nausea, diarrhea, metallic taste, vitamin B12 deficiency, lactic acidosis (rare).',
        warnings: 'Take with meals. Monitor kidney function. Stop before surgery or contrast procedures.',
        interactions: 'Alcohol, contrast dyes, diuretics, steroids'
      }
    };

    // Check for specific medication
    for (const [medKey, medData] of Object.entries(medicationInfo)) {
      if (query.includes(medKey)) {
        let response = `📋 **${medData.name}**\n\n`;
        
        if (query.includes('dosage') || query.includes('dose') || query.includes('how much') || query.includes('how to take')) {
          response += `💊 **Dosage:** ${medData.dosage}\n\n`;
        } else if (query.includes('side effect') || query.includes('adverse') || query.includes('reaction')) {
          response += `⚠️ **Side Effects:** ${medData.sideEffects}\n\n`;
        } else if (query.includes('interaction') || query.includes('other drug') || query.includes('combine')) {
          response += `🔄 **Drug Interactions:** ${medData.interactions}\n\n`;
        } else if (query.includes('warning') || query.includes('caution') || query.includes('careful')) {
          response += `🚨 **Warnings:** ${medData.warnings}\n\n`;
        } else {
          // Comprehensive information
          response += `🎯 **Uses:** ${medData.uses}\n\n`;
          response += `💊 **Dosage:** ${medData.dosage}\n\n`;
          response += `⚠️ **Common Side Effects:** ${medData.sideEffects}\n\n`;
          response += `🚨 **Important Warnings:** ${medData.warnings}\n\n`;
          response += `🔄 **Drug Interactions:** ${medData.interactions}\n\n`;
        }
        
        response += `⚕️ **Medical Disclaimer:** This information is for educational purposes only. Always consult your doctor or pharmacist for personalized medical advice, proper diagnosis, and treatment recommendations.`;
        
        return response;
      }
    }

    // General medication queries
    if (query.includes('side effect')) {
      return `⚠️ **Common Medication Side Effects:**

• **Gastrointestinal:** Nausea, vomiting, diarrhea, stomach upset
• **Neurological:** Dizziness, headache, drowsiness
• **Allergic:** Skin rash, itching, swelling
• **Cardiovascular:** Changes in blood pressure or heart rate

🚨 **Seek immediate medical attention if you experience:**
• Difficulty breathing or swallowing
• Severe allergic reactions (hives, swelling)
• Chest pain or irregular heartbeat
• Severe or persistent side effects

Always read medication leaflets and consult your healthcare provider about any concerns.`;
    }

    if (query.includes('dosage') || query.includes('dose') || query.includes('how much')) {
      return `💊 **Medication Dosage Guidelines:**

• **Always follow your doctor's prescription exactly**
• **Never adjust doses without medical supervision**
• **Take medications at prescribed times**
• **Complete full courses of antibiotics**

📋 **Factors affecting dosage:**
• Age and weight
• Kidney and liver function
• Other medications
• Medical conditions
• Severity of condition

For specific dosage information, please consult your doctor or pharmacist with your prescription details.`;
    }

    if (query.includes('interaction') || query.includes('combine') || query.includes('together')) {
      return `🔄 **Drug Interactions:**

**Common interaction types:**
• Blood thinners + NSAIDs = Increased bleeding risk
• Antibiotics + Birth control = Reduced contraceptive effectiveness
• Alcohol + Medications = Enhanced side effects
• Multiple pain relievers = Overdose risk

⚠️ **Always inform your healthcare providers about:**
• All prescription medications
• Over-the-counter drugs
• Herbal supplements
• Vitamins and minerals

Use a medication list or app to track all your medications and show it to every healthcare provider you visit.`;
    }

    // Default medication response
    return `💊 **Medication Information Service**

I can help you with information about common medications including:

🔹 **Pain relievers:** Paracetamol, Ibuprofen, Aspirin
🔹 **Antibiotics:** Amoxicillin, Penicillin
🔹 **Diabetes medications:** Metformin, Insulin
🔹 **Heart medications:** ACE inhibitors, Beta-blockers

**Ask me about:**
• Dosages and how to take medications
• Common side effects and warnings
• Drug interactions
• When to seek medical help

**Example questions:**
• "Tell me about ibuprofen side effects"
• "How should I take paracetamol?"
• "What are aspirin interactions?"

What specific medication would you like to know about?`;
  };

  const handleAppointmentQuery = async (query: string): Promise<string> => {
    try {
      const doctors = await fetch(`${API_BASE}/doctors`).then(res => res.json());
      const departments = await fetch(`${API_BASE}/departments`).then(res => res.json());
      
      if (query.includes('book') || query.includes('schedule') || query.includes('make')) {
        const availableSpecialties = [...new Set(doctors.map((d: any) => d.specialization))].filter(Boolean);
        
        return `📅 **Book an Appointment**

**How to schedule:**
📞 **Call:** (555) 123-CARE (24/7 appointment line)
🏥 **Visit:** Reception desk (Ground floor, Main building)
💻 **Online:** Patient portal (coming soon)

**Available specialties:**
${availableSpecialties.map(spec => `• ${spec}`).join('\n')}

**We have ${doctors.length} doctors available across ${departments.length} departments.**

**What you'll need:**
• Patient ID or personal details
• Preferred doctor or specialty
• Preferred date and time
• Insurance information
• Reason for visit

**Appointment times:**
• Monday-Friday: 8:00 AM - 6:00 PM
• Saturday: 9:00 AM - 2:00 PM
• Emergency: 24/7

Would you like me to help you find a specific type of specialist?`;
      }

      if (query.includes('cancel')) {
        return `❌ **Cancel Appointment**

**To cancel your appointment:**
📞 **Call:** (555) 123-CARE
🕐 **Notice required:** At least 24 hours in advance
📋 **Information needed:** 
• Patient name and ID
• Appointment date and time
• Doctor's name

**Cancellation policy:**
• 24+ hours notice: No charge
• Less than 24 hours: May incur cancellation fee
• No-show: Full consultation fee may apply

**Need to reschedule instead?** We can help you find a new appointment time that works better for you.

Our staff is available 24/7 to assist with appointment changes.`;
      }

      if (query.includes('reschedule') || query.includes('change')) {
        return `🔄 **Reschedule Appointment**

**To reschedule your appointment:**
📞 **Call:** (555) 123-CARE
📋 **Have ready:**
• Current appointment details
• Preferred new date/time options
• Patient ID

**Rescheduling options:**
• Same doctor, different time
• Different doctor, same specialty
• Urgent vs. routine scheduling

**Best times for appointments:**
• Tuesday-Thursday: Most availability
• Morning slots: 8:00 AM - 12:00 PM
• Afternoon slots: 1:00 PM - 5:00 PM

We'll do our best to accommodate your preferred timing while ensuring you get the care you need.`;
      }

      return `📅 **Appointment Services**

**Available services:**
• Book new appointments
• Cancel existing appointments  
• Reschedule appointments
• Check appointment status
• Find available doctors

**Contact information:**
📞 **Main line:** (555) 123-CARE
🏥 **Location:** HealthLock Hospital, Main Reception
⏰ **Hours:** 24/7 appointment assistance

How can I help you with your appointment today?`;
      
    } catch (error) {
      return `📅 **Appointment Information**

**To manage your appointments:**
📞 **Call:** (555) 123-CARE (24/7)
🏥 **Visit:** Reception desk at main entrance

**Services available:**
• Book new appointments
• Cancel or reschedule existing appointments
• Emergency appointment scheduling
• Specialist referrals

Our friendly staff is available around the clock to help with all your appointment needs.`;
    }
  };

  const handleDoctorQuery = async (query: string): Promise<string> => {
    try {
      const doctors = await fetch(`${API_BASE}/doctors`).then(res => res.json());
      
      if (query.includes('cardiology') || query.includes('heart')) {
        const cardiologists = doctors.filter((d: any) => d.specialization?.toLowerCase().includes('cardiology'));
        return cardiologists.length > 0 
          ? `We have ${cardiologists.length} cardiologist(s) available: ${cardiologists.map((d: any) => d.name).join(', ')}. Call (555) 123-CARE to book an appointment.`
          : "We have cardiology services available. Please call (555) 123-CARE for appointment scheduling.";
      }

      if (query.includes('neurology') || query.includes('brain')) {
        const neurologists = doctors.filter((d: any) => d.specialization?.toLowerCase().includes('neurology'));
        return neurologists.length > 0 
          ? `We have ${neurologists.length} neurologist(s) available: ${neurologists.map((d: any) => d.name).join(', ')}. Call (555) 123-CARE to book an appointment.`
          : "We have neurology services available. Please call (555) 123-CARE for appointment scheduling.";
      }

      if (query.includes('orthopedic') || query.includes('bone') || query.includes('joint')) {
        const orthopedics = doctors.filter((d: any) => d.specialization?.toLowerCase().includes('orthopedic'));
        return orthopedics.length > 0 
          ? `We have ${orthopedics.length} orthopedic specialist(s) available: ${orthopedics.map((d: any) => d.name).join(', ')}. Call (555) 123-CARE to book an appointment.`
          : "We have orthopedic services available. Please call (555) 123-CARE for appointment scheduling.";
      }

      if (query.includes('pediatric') || query.includes('child') || query.includes('kids')) {
        const pediatricians = doctors.filter((d: any) => d.specialization?.toLowerCase().includes('pediatric'));
        return pediatricians.length > 0 
          ? `We have ${pediatricians.length} pediatrician(s) available: ${pediatricians.map((d: any) => d.name).join(', ')}. Call (555) 123-CARE to book an appointment.`
          : "We have pediatric services available. Please call (555) 123-CARE for appointment scheduling.";
      }

      return `We have ${doctors.length} doctors across various specialties including Cardiology, Neurology, Orthopedics, Pediatrics, and Emergency Medicine. What type of specialist are you looking for?`;
    } catch (error) {
      return "We have doctors available across multiple specialties. Please call (555) 123-CARE for doctor information and appointments.";
    }
  };

  const handleDepartmentQuery = async (query: string): Promise<string> => {
    try {
      const departments = await fetch(`${API_BASE}/departments`).then(res => res.json());
      
      const deptList = departments.map((d: any) => d.name).join(', ');
      return `Our hospital has the following departments: ${deptList}. Each department provides specialized care and services. Which department would you like to know more about?`;
    } catch (error) {
      return "Our hospital has multiple departments including Emergency, Cardiology, Neurology, Orthopedics, and Pediatrics. How can I help you with our services?";
    }
  };

  const handleRoomQuery = async (query: string): Promise<string> => {
    try {
      const rooms = await fetch(`${API_BASE}/rooms`).then(res => res.json());
      const availableRooms = rooms.filter((r: any) => r.status?.toLowerCase() === 'available');
      
      return `We currently have ${availableRooms.length} rooms available for admission. Room types include General, Private, ICU, Surgery, and Maternity wards. For admission inquiries, please contact (555) 123-CARE.`;
    } catch (error) {
      return "We have various room types available including General, Private, ICU, and specialty wards. For admission information, please call (555) 123-CARE.";
    }
  };

  const handleEmergencyQuery = (query: string): string => {
    return "🚨 EMERGENCY SERVICES 🚨\n\nFor immediate medical emergencies:\n• Call 911 or go to the nearest emergency room\n• Our Emergency Department is open 24/7\n• Location: Ground Floor, Main Building\n• Emergency Hotline: (555) 911-HELP\n\nFor non-emergency urgent care, call (555) 123-CARE.";
  };

  const handleHealthQuery = (query: string): string => {
    if (query.includes('fever')) {
      return `🌡️ **Fever Management:**

**Immediate care:**
• Rest and stay hydrated (water, clear fluids)
• Take paracetamol or ibuprofen as directed
• Use cool compresses on forehead
• Wear light clothing

**Seek medical attention if:**
• Temperature exceeds 103°F (39.4°C)
• Fever persists for more than 3 days
• Difficulty breathing or chest pain
• Severe headache or neck stiffness
• Persistent vomiting or dehydration
• Confusion or unusual behavior

**For children:** Seek immediate care if under 3 months with any fever, or if fever is accompanied by unusual symptoms.

This is general advice. Please consult a healthcare professional for proper diagnosis and treatment.`;
    }

    if (query.includes('headache')) {
      return `🤕 **Headache Relief:**

**Home remedies:**
• Rest in a quiet, dark room
• Apply cold or warm compress to head/neck
• Stay hydrated
• Gentle neck and shoulder massage
• Over-the-counter pain relievers (paracetamol, ibuprofen)

**Seek immediate medical attention for:**
• Sudden, severe "thunderclap" headache
• Headache with fever and stiff neck
• Headache after head injury
• Vision changes or weakness
• Headache with confusion or difficulty speaking

**Prevention tips:**
• Regular sleep schedule
• Stay hydrated
• Manage stress
• Avoid known triggers

Consult a healthcare professional if headaches are frequent, severe, or interfering with daily activities.`;
    }

    if (query.includes('pain')) {
      return `😣 **Pain Management:**

**General pain relief:**
• Rest the affected area
• Apply ice (first 24-48 hours) or heat (after swelling reduces)
• Over-the-counter pain relievers as directed
• Gentle stretching or movement as tolerated
• Elevation if applicable (for limb injuries)

**Seek medical attention for:**
• Severe or worsening pain
• Pain after injury or trauma
• Pain with numbness or tingling
• Pain that interferes with daily activities
• Signs of infection (redness, warmth, swelling)

**Chronic pain:** Requires professional evaluation and management. Don't suffer in silence - many effective treatments are available.

Please consult a healthcare professional for proper evaluation and treatment recommendations.`;
    }

    if (query.includes('cough') || query.includes('cold')) {
      return `🤧 **Cough and Cold Care:**

**Home remedies:**
• Stay hydrated (warm liquids, herbal teas)
• Honey for cough (not for children under 1 year)
• Humidifier or steam inhalation
• Salt water gargle for sore throat
• Rest and adequate sleep

**Over-the-counter options:**
• Cough suppressants for dry cough
• Expectorants for productive cough
• Decongestants for nasal congestion
• Pain relievers for aches

**See a doctor if:**
• Symptoms persist more than 10 days
• High fever (over 101.3°F/38.5°C)
• Difficulty breathing or wheezing
• Chest pain or persistent headache
• Coughing up blood or thick, colored mucus

Most colds resolve on their own within 7-10 days with supportive care.`;
    }

    // General health response
    return `🏥 **Health Information Service**

I can provide guidance on common health concerns:

**Symptoms I can help with:**
🔹 Fever and temperature management
🔹 Headaches and pain relief
🔹 Cough and cold symptoms
🔹 Minor injuries and first aid
🔹 When to seek medical attention

**General health tips:**
• Stay hydrated (8 glasses of water daily)
• Get adequate sleep (7-9 hours)
• Regular exercise and healthy diet
• Manage stress effectively
• Regular health check-ups

**Always seek professional medical care for:**
• Severe or persistent symptoms
• Emergency situations
• Chronic health conditions
• Medication management
• Preventive care and screenings

What specific health concern can I help you with today?`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-96 shadow-2xl border-0 bg-gradient-to-br from-card to-card/95 backdrop-blur-md transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {language === 'hi' ? 'चिकित्सा सहायक' : 'Medical Assistant'}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {language === 'hi' ? 'AI-संचालित स्वास्थ्य सहायक' : 'AI-Powered Healthcare Helper'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="h-8 w-8 p-0"
                title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
              >
                <Languages className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted text-foreground p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border/50 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    {language === 'hi' ? 'चिकित्सा AI' : 'Medical AI'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    {language === 'hi' ? 'हिंदी' : 'English'}
                  </Badge>
                  {aiEnabled && (
                    <Badge variant="default" className="text-xs bg-green-500">
                      ✨ AI
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className="h-8 w-8 p-0"
                >
                  {speechEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      {language === 'hi' ? 'सुनना बंद करें' : 'Stop Listening'}
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      {language === 'hi' ? 'आवाज़ शुरू करें' : 'Start Voice'}
                    </>
                  )}
                </Button>

                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {language === 'hi' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("पैरासिटामोल के बारे में बताएं")}
                      className="text-xs"
                    >
                      <Pill className="h-3 w-3 mr-1" />
                      दवा की जानकारी
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("अपॉइंटमेंट बुक करें")}
                      className="text-xs"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      अपॉइंटमेंट बुक करें
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("मुझे बुखार है")}
                      className="text-xs"
                    >
                      <Stethoscope className="h-3 w-3 mr-1" />
                      लक्षण जांच
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("आपातकालीन सेवाएं")}
                      className="text-xs"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      आपातकाल
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("Tell me about paracetamol")}
                      className="text-xs"
                    >
                      <Pill className="h-3 w-3 mr-1" />
                      Medication Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("Book an appointment")}
                      className="text-xs"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Book Appointment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("I have a fever")}
                      className="text-xs"
                    >
                      <Stethoscope className="h-3 w-3 mr-1" />
                      Symptom Check
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserMessage("Emergency services")}
                      className="text-xs"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Emergency
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{language === 'hi' ? 'अपॉइंटमेंट' : 'Appointments'}</span>
                <span>•</span>
                <Phone className="h-3 w-3" />
                <span>(555) 123-CARE</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};