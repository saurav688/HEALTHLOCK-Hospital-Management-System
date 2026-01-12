import express from "express";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Room from "../models/Room.js";
import Department from "../models/Department.js";
import Admission from "../models/Admission.js";

const router = express.Router();

// Medical knowledge base
const medicationDatabase = {
  paracetamol: {
    name: "Paracetamol",
    nameHi: "पैरासिटामोल",
    category: "Analgesic/Antipyretic",
    categoryHi: "दर्द निवारक/बुखार कम करने वाली",
    uses: ["Pain relief", "Fever reduction"],
    usesHi: ["दर्द निवारण", "बुखार कम करना"],
    dosage: "500mg-1g every 4-6 hours, maximum 4g per day",
    dosageHi: "500mg-1g हर 4-6 घंटे में, अधिकतम 4g प्रति दिन",
    sideEffects: ["Rare: liver damage with overdose", "Nausea (uncommon)"],
    sideEffectsHi: ["दुर्लभ: अधिक मात्रा से लीवर को नुकसान", "मतली (असामान्य)"],
    warnings: ["Avoid alcohol", "Do not exceed maximum dose", "Consult doctor if symptoms persist"],
    warningsHi: ["शराब से बचें", "अधिकतम खुराक न बढ़ाएं", "लक्षण बने रहने पर डॉक्टर से सलाह लें"],
    interactions: ["Warfarin (blood thinner)", "Alcohol"],
    interactionsHi: ["वार्फरिन (रक्त पतला करने वाली दवा)", "शराब"]
  },
  ibuprofen: {
    name: "Ibuprofen",
    nameHi: "आइबुप्रोफेन",
    category: "NSAID (Non-steroidal anti-inflammatory drug)",
    categoryHi: "NSAID (गैर-स्टेरायडल सूजन रोधी दवा)",
    uses: ["Pain relief", "Inflammation reduction", "Fever reduction"],
    usesHi: ["दर्द निवारण", "सूजन कम करना", "बुखार कम करना"],
    dosage: "200-400mg every 4-6 hours with food, maximum 1200mg per day",
    dosageHi: "200-400mg हर 4-6 घंटे में भोजन के साथ, अधिकतम 1200mg प्रति दिन",
    sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "Headache"],
    sideEffectsHi: ["पेट खराब", "सीने में जलन", "चक्कर आना", "सिरदर्द"],
    warnings: ["Take with food", "Avoid if allergic to aspirin", "May increase blood pressure"],
    warningsHi: ["भोजन के साथ लें", "एस्पिरिन से एलर्जी हो तो बचें", "रक्तचाप बढ़ा सकती है"],
    interactions: ["Blood thinners", "ACE inhibitors", "Diuretics"],
    interactionsHi: ["रक्त पतला करने वाली दवाएं", "ACE अवरोधक", "मूत्रवर्धक"]
  },
  aspirin: {
    name: "Aspirin",
    nameHi: "एस्पिरिन",
    category: "NSAID/Antiplatelet",
    categoryHi: "NSAID/प्लेटलेट रोधी",
    uses: ["Pain relief", "Blood clot prevention", "Heart attack prevention"],
    usesHi: ["दर्द निवारण", "रक्त के थक्के रोकना", "दिल का दौरा रोकना"],
    dosage: "75-300mg daily as prescribed, take with food",
    dosageHi: "75-300mg दैनिक जैसा निर्धारित हो, भोजन के साथ लें",
    sideEffects: ["Stomach irritation", "Bleeding risk", "Tinnitus"],
    sideEffectsHi: ["पेट में जलन", "रक्तस्राव का खतरा", "कान में आवाज"],
    warnings: ["Not for children under 16", "Bleeding risk", "Take with food"],
    warningsHi: ["16 साल से कम बच्चों के लिए नहीं", "रक्तस्राव का खतरा", "भोजन के साथ लें"],
    interactions: ["Warfarin", "Methotrexate", "Alcohol"],
    interactionsHi: ["वार्फरिन", "मेथोट्रेक्सेट", "शराब"]
  },
  amoxicillin: {
    name: "Amoxicillin",
    nameHi: "एमोक्सिसिलिन",
    category: "Antibiotic (Penicillin)",
    categoryHi: "एंटीबायोटिक (पेनिसिलिन)",
    uses: ["Bacterial infections", "Respiratory infections", "Urinary tract infections"],
    usesHi: ["बैक्टीरियल संक्रमण", "श्वसन संक्रमण", "मूत्र पथ संक्रमण"],
    dosage: "250-500mg every 8 hours, complete full course",
    dosageHi: "250-500mg हर 8 घंटे में, पूरा कोर्स पूरा करें",
    sideEffects: ["Nausea", "Diarrhea", "Skin rash", "Allergic reactions"],
    sideEffectsHi: ["मतली", "दस्त", "त्वचा पर चकत्ते", "एलर्जी प्रतिक्रियाएं"],
    warnings: ["Complete full course", "Allergic to penicillin", "May reduce contraceptive effectiveness"],
    warningsHi: ["पूरा कोर्स पूरा करें", "पेनिसिलिन से एलर्जी", "गर्भनिरोधक प्रभावशीलता कम कर सकती है"],
    interactions: ["Oral contraceptives", "Methotrexate", "Allopurinol"],
    interactionsHi: ["मौखिक गर्भनिरोधक", "मेथोट्रेक्सेट", "एलोप्यूरिनॉल"]
  },
  metformin: {
    name: "Metformin",
    nameHi: "मेटफॉर्मिन",
    category: "Antidiabetic (Biguanide)",
    categoryHi: "मधुमेह रोधी (बिगुआनाइड)",
    uses: ["Type 2 diabetes", "Blood sugar control", "PCOS treatment"],
    usesHi: ["टाइप 2 मधुमेह", "रक्त शर्करा नियंत्रण", "PCOS उपचार"],
    dosage: "500mg-1g twice daily with meals",
    dosageHi: "500mg-1g दिन में दो बार भोजन के साथ",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Vitamin B12 deficiency"],
    sideEffectsHi: ["मतली", "दस्त", "धातु का स्वाद", "विटामिन B12 की कमी"],
    warnings: ["Take with meals", "Monitor kidney function", "Stop before surgery"],
    warningsHi: ["भोजन के साथ लें", "किडनी की कार्यप्रणाली की निगरानी करें", "सर्जरी से पहले बंद करें"],
    interactions: ["Alcohol", "Contrast dyes", "Diuretics"],
    interactionsHi: ["शराब", "कंट्रास्ट डाई", "मूत्रवर्धक"]
  }
};

// Symptom checker database
const symptomDatabase = {
  fever: {
    description: "Elevated body temperature above 100.4°F (38°C)",
    descriptionHi: "100.4°F (38°C) से अधिक शरीर का तापमान",
    commonCauses: ["Viral infections", "Bacterial infections", "Inflammatory conditions"],
    commonCausesHi: ["वायरल संक्रमण", "बैक्टीरियल संक्रमण", "सूजन की स्थिति"],
    homeRemedies: ["Rest", "Hydration", "Paracetamol/Ibuprofen", "Cool compress"],
    homeRemediesHi: ["आराम", "पानी पीना", "पैरासिटामोल/आइबुप्रोफेन", "ठंडी पट्टी"],
    seekHelp: ["Temperature above 103°F (39.4°C)", "Difficulty breathing", "Severe headache", "Persistent vomiting"],
    seekHelpHi: ["103°F (39.4°C) से अधिक तापमान", "सांस लेने में कठिनाई", "तेज सिरदर्द", "लगातार उल्टी"],
    department: "Emergency or General Medicine",
    departmentHi: "आपातकाल या सामान्य चिकित्सा"
  },
  headache: {
    description: "Pain in the head or neck region",
    descriptionHi: "सिर या गर्दन के क्षेत्र में दर्द",
    commonCauses: ["Tension", "Dehydration", "Stress", "Sinus congestion", "Migraine"],
    commonCausesHi: ["तनाव", "निर्जलीकरण", "तनाव", "साइनस की रुकावट", "माइग्रेन"],
    homeRemedies: ["Rest in dark room", "Hydration", "Cold/warm compress", "Gentle massage"],
    homeRemediesHi: ["अंधेरे कमरे में आराम", "पानी पीना", "ठंडी/गर्म पट्टी", "हल्की मालिश"],
    seekHelp: ["Sudden severe headache", "Headache with fever and stiff neck", "Vision changes", "Weakness"],
    seekHelpHi: ["अचानक तेज सिरदर्द", "बुखार और गर्दन में अकड़न के साथ सिरदर्द", "दृष्टि में परिवर्तन", "कमजोरी"],
    department: "Neurology or Emergency",
    departmentHi: "न्यूरोलॉजी या आपातकाल"
  },
  chestPain: {
    description: "Discomfort or pain in the chest area",
    descriptionHi: "छाती के क्षेत्र में असुविधा या दर्द",
    commonCauses: ["Muscle strain", "Acid reflux", "Anxiety", "Heart conditions"],
    commonCausesHi: ["मांसपेशियों में खिंचाव", "एसिड रिफ्लक्स", "चिंता", "हृदय की स्थिति"],
    homeRemedies: ["Rest", "Antacids for heartburn", "Deep breathing"],
    homeRemediesHi: ["आराम", "सीने की जलन के लिए एंटासिड", "गहरी सांस लेना"],
    seekHelp: ["Severe crushing pain", "Pain radiating to arm/jaw", "Shortness of breath", "Sweating"],
    seekHelpHi: ["तेज दबाने वाला दर्द", "बांह/जबड़े में फैलने वाला दर्द", "सांस की तकलीफ", "पसीना आना"],
    department: "Emergency or Cardiology",
    departmentHi: "आपातकाल या हृदय रोग"
  }
};

// GET medication information
router.get("/medication/:name", async (req, res) => {
  try {
    const medicationName = req.params.name.toLowerCase();
    const medication = medicationDatabase[medicationName];
    
    if (medication) {
      res.json({
        success: true,
        medication: medication,
        disclaimer: "This information is for educational purposes only. Always consult your healthcare provider for medical advice."
      });
    } else {
      res.json({
        success: false,
        message: "Medication not found in our database. Please consult your pharmacist or doctor.",
        availableMedications: Object.keys(medicationDatabase)
      });
    }
  } catch (err) {
    console.error("Error fetching medication info:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET symptom information
router.get("/symptom/:name", async (req, res) => {
  try {
    const symptomName = req.params.name.toLowerCase();
    const symptom = symptomDatabase[symptomName];
    
    if (symptom) {
      res.json({
        success: true,
        symptom: symptom,
        disclaimer: "This information is for educational purposes only. Always consult a healthcare professional for proper diagnosis and treatment."
      });
    } else {
      res.json({
        success: false,
        message: "Symptom not found in our database. Please consult a healthcare professional.",
        availableSymptoms: Object.keys(symptomDatabase)
      });
    }
  } catch (err) {
    console.error("Error fetching symptom info:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST AI query processing
router.post("/query", async (req, res) => {
  try {
    const { query, language = 'en', patientId } = req.body;
    const lowerQuery = query.toLowerCase();
    
    let response = {
      success: true,
      answer: "",
      suggestions: [],
      relatedInfo: {}
    };

    // Helper function to detect Hindi text
    const containsHindi = (text) => {
      const hindiRegex = /[\u0900-\u097F]/;
      return hindiRegex.test(text);
    };

    // Determine if query is in Hindi
    const isHindi = language === 'hi' || containsHindi(query);

    // Check for medication queries (both English and Hindi names)
    for (const [medName, medInfo] of Object.entries(medicationDatabase)) {
      if (lowerQuery.includes(medName) || 
          (medInfo.nameHi && query.includes(medInfo.nameHi))) {
        
        if (isHindi) {
          response.answer = `${medInfo.nameHi} के बारे में जानकारी:\n\n` +
            `श्रेणी: ${medInfo.categoryHi}\n` +
            `उपयोग: ${medInfo.usesHi.join(', ')}\n` +
            `खुराक: ${medInfo.dosageHi}\n` +
            `सामान्य दुष्प्रभाव: ${medInfo.sideEffectsHi.join(', ')}\n\n` +
            `महत्वपूर्ण चेतावनी: ${medInfo.warningsHi.join(', ')}\n\n` +
            `व्यक्तिगत सलाह के लिए कृपया अपने डॉक्टर या फार्मासिस्ट से सलाह लें।`;
        } else {
          response.answer = `Here's information about ${medInfo.name}:\n\n` +
            `Category: ${medInfo.category}\n` +
            `Uses: ${medInfo.uses.join(', ')}\n` +
            `Dosage: ${medInfo.dosage}\n` +
            `Common side effects: ${medInfo.sideEffects.join(', ')}\n\n` +
            `Important warnings: ${medInfo.warnings.join(', ')}\n\n` +
            `Please consult your doctor or pharmacist for personalized advice.`;
        }
        
        response.relatedInfo = { type: 'medication', data: medInfo };
        break;
      }
    }

    // Check for symptom queries (both English and Hindi)
    if (!response.answer) {
      const hindiSymptoms = {
        'बुखार': 'fever',
        'ज्वर': 'fever',
        'सिरदर्द': 'headache',
        'सिर में दर्द': 'headache',
        'छाती में दर्द': 'chestPain',
        'सीने में दर्द': 'chestPain'
      };

      let foundSymptom = null;
      let symptomKey = null;

      // Check Hindi symptoms first
      for (const [hindiName, englishKey] of Object.entries(hindiSymptoms)) {
        if (query.includes(hindiName)) {
          foundSymptom = symptomDatabase[englishKey];
          symptomKey = englishKey;
          break;
        }
      }

      // Check English symptoms if not found in Hindi
      if (!foundSymptom) {
        for (const [symptomName, symptomInfo] of Object.entries(symptomDatabase)) {
          if (lowerQuery.includes(symptomName)) {
            foundSymptom = symptomInfo;
            symptomKey = symptomName;
            break;
          }
        }
      }

      if (foundSymptom) {
        if (isHindi) {
          response.answer = `${symptomKey === 'fever' ? 'बुखार' : symptomKey === 'headache' ? 'सिरदर्द' : 'छाती में दर्द'} के बारे में जानकारी:\n\n` +
            `विवरण: ${foundSymptom.descriptionHi}\n` +
            `सामान्य कारण: ${foundSymptom.commonCausesHi.join(', ')}\n` +
            `घरेलू उपचार: ${foundSymptom.homeRemediesHi.join(', ')}\n\n` +
            `तुरंत चिकित्सा सहायता लें यदि आप अनुभव करें: ${foundSymptom.seekHelpHi.join(', ')}\n` +
            `अनुशंसित विभाग: ${foundSymptom.departmentHi}\n\n` +
            `यह सामान्य जानकारी है। उचित मूल्यांकन के लिए कृपया स्वास्थ्य पेशेवर से सलाह लें।`;
        } else {
          response.answer = `Information about ${symptomKey}:\n\n` +
            `Description: ${foundSymptom.description}\n` +
            `Common causes: ${foundSymptom.commonCauses.join(', ')}\n` +
            `Home remedies: ${foundSymptom.homeRemedies.join(', ')}\n\n` +
            `Seek immediate medical help if you experience: ${foundSymptom.seekHelp.join(', ')}\n` +
            `Recommended department: ${foundSymptom.department}\n\n` +
            `This is general information. Please consult a healthcare professional for proper evaluation.`;
        }
        
        response.relatedInfo = { type: 'symptom', data: foundSymptom };
      }
    }

    // Doctor/appointment queries (English and Hindi)
    if (!response.answer && (lowerQuery.includes('doctor') || lowerQuery.includes('appointment') ||
        query.includes('डॉक्टर') || query.includes('अपॉइंटमेंट') || query.includes('चिकित्सक'))) {
      const doctors = await Doctor.find({ status: 'Active' });
      
      if (isHindi) {
        response.answer = `हमारे पास विभिन्न विशेषताओं में ${doctors.length} डॉक्टर उपलब्ध हैं। ` +
          `अपॉइंटमेंट बुक करने के लिए, (555) 123-CARE पर कॉल करें या हमारे रिसेप्शन डेस्क पर आएं।\n\n` +
          `उपलब्ध विशेषताएं: ${[...new Set(doctors.map(d => d.specialization))].join(', ')}`;
        
        response.suggestions = [
          "अपॉइंटमेंट बुक करें",
          "विशेषज्ञ खोजें",
          "आपातकालीन सेवाएं",
          "विभाग की जानकारी"
        ];
      } else {
        response.answer = `We have ${doctors.length} doctors available across various specialties. ` +
          `To book an appointment, call (555) 123-CARE or visit our reception desk.\n\n` +
          `Available specialties: ${[...new Set(doctors.map(d => d.specialization))].join(', ')}`;
        
        response.suggestions = [
          "Book an appointment",
          "Find a specialist",
          "Emergency services",
          "Department information"
        ];
      }
    }

    // Emergency queries (English and Hindi)
    if (!response.answer && (lowerQuery.includes('emergency') || lowerQuery.includes('urgent') ||
        query.includes('आपातकाल') || query.includes('इमरजेंसी') || query.includes('तुरंत'))) {
      
      if (isHindi) {
        response.answer = "🚨 आपातकालीन सेवाएं 🚨\n\n" +
          "तत्काल चिकित्सा आपातकाल के लिए:\n" +
          "• 102 या 108 पर कॉल करें या निकटतम आपातकालीन कक्ष में जाएं\n" +
          "• हमारा आपातकालीन विभाग 24/7 खुला है\n" +
          "• स्थान: भूतल, मुख्य भवन\n" +
          "• आपातकालीन हॉटलाइन: (555) 911-HELP\n\n" +
          "गैर-आपातकालीन तत्काल देखभाल के लिए, (555) 123-CARE पर कॉल करें।";
      } else {
        response.answer = "🚨 EMERGENCY SERVICES 🚨\n\n" +
          "For immediate medical emergencies:\n" +
          "• Call 911 or go to the nearest emergency room\n" +
          "• Our Emergency Department is open 24/7\n" +
          "• Location: Ground Floor, Main Building\n" +
          "• Emergency Hotline: (555) 911-HELP\n\n" +
          "For non-emergency urgent care, call (555) 123-CARE.";
      }
    }

    // Default response (English and Hindi)
    if (!response.answer) {
      if (isHindi) {
        response.answer = "मैं आपकी इन चीजों में सहायता कर सकता हूं:\n" +
          "• दवाओं की जानकारी और दुष्प्रभाव\n" +
          "• लक्षण मार्गदर्शन और कब सहायता लेनी है\n" +
          "• डॉक्टर की अपॉइंटमेंट और विशेषताएं\n" +
          "• अस्पताल सेवाएं और विभाग\n" +
          "• आपातकालीन संपर्क जानकारी\n\n" +
          "आप और क्या जानना चाहते हैं?";
        
        response.suggestions = [
          "दवा की जानकारी",
          "लक्षण जांच",
          "अपॉइंटमेंट बुक करें",
          "आपातकालीन सेवाएं"
        ];
      } else {
        response.answer = "I can help you with:\n" +
          "• Medication information and side effects\n" +
          "• Symptom guidance and when to seek help\n" +
          "• Doctor appointments and specialties\n" +
          "• Hospital services and departments\n" +
          "• Emergency contact information\n\n" +
          "What would you like to know more about?";
        
        response.suggestions = [
          "Medication information",
          "Symptom checker",
          "Book appointment",
          "Emergency services"
        ];
      }
    }

    res.json(response);
  } catch (err) {
    console.error("Error processing AI query:", err);
    res.status(500).json({ 
      success: false, 
      message: "I'm having trouble processing your request. Please try again or contact our support team." 
    });
  }
});

// GET hospital statistics for AI responses
router.get("/stats", async (req, res) => {
  try {
    const [patients, doctors, rooms, departments, admissions] = await Promise.all([
      Patient.countDocuments({ status: 'Active' }),
      Doctor.countDocuments({ status: 'Active' }),
      Room.countDocuments({ status: 'Available' }),
      Department.countDocuments(),
      Admission.countDocuments({ status: 'Admitted' })
    ]);

    res.json({
      patients,
      doctors,
      availableRooms: rooms,
      departments,
      currentAdmissions: admissions,
      emergencyContact: "(555) 911-HELP",
      appointmentLine: "(555) 123-CARE"
    });
  } catch (err) {
    console.error("Error fetching hospital stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;