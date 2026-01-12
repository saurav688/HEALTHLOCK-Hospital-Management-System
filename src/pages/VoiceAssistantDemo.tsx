import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceAssistantButton } from "@/components/VoiceAssistantButton";
import {
  Bot,
  Mic,
  Volume2,
  Stethoscope,
  Pill,
  Calendar,
  Phone,
  Heart,
  Brain,
  Shield,
  Zap
} from "lucide-react";

const VoiceAssistantDemo = () => {
  const features = [
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Speak naturally and the AI will understand your medical queries",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Get spoken responses for hands-free interaction",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Pill,
      title: "Medication Information",
      description: "Ask about dosages, side effects, and drug interactions",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description: "Schedule appointments with doctors and specialists",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Stethoscope,
      title: "Symptom Checker",
      description: "Get guidance on symptoms and when to seek medical help",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Phone,
      title: "Emergency Services",
      description: "Quick access to emergency contacts and procedures",
      color: "from-red-600 to-red-700"
    }
  ];

  const sampleQueries = [
    "Tell me about paracetamol side effects",
    "पैरासिटामोल के बारे में बताएं",
    "I have a fever, what should I do?",
    "मुझे बुखार है, क्या करूं?",
    "Book an appointment with a cardiologist",
    "हृदय रोग विशेषज्ञ से अपॉइंटमेंट बुक करें",
    "What are the emergency contact numbers?",
    "आपातकालीन संपर्क नंबर क्या हैं?",
    "How do I take ibuprofen safely?",
    "आइबुप्रोफेन कैसे सुरक्षित रूप से लें?",
    "I have chest pain, is this serious?",
    "मुझे सीने में दर्द है, क्या यह गंभीर है?",
    "What departments do you have?",
    "आपके पास कौन से विभाग हैं?",
    "Are there any available rooms?",
    "क्या कोई उपलब्ध कमरे हैं?"
  ];

  const capabilities = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced natural language processing for medical queries"
    },
    {
      icon: Shield,
      title: "Medical Knowledge Base",
      description: "Comprehensive database of medications and symptoms"
    },
    {
      icon: Zap,
      title: "Real-time Integration",
      description: "Live data from hospital systems for accurate information"
    },
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Designed specifically for patient needs and concerns"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI Voice Assistant
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your intelligent medical companion for medication information, appointments, and healthcare guidance
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="px-3 py-1">
            <Mic className="h-3 w-3 mr-1" />
            Voice Enabled
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Medical Grade
          </Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card 
            key={feature.title}
            className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sample Queries */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Try These Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {sampleQueries.map((query, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium">"{query}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <div key={capability.title} className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                  <capability.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">How to Use the Voice Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Click the Voice Button</h3>
              <p className="text-sm text-muted-foreground">Look for the floating AI assistant button in the bottom right corner</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Start Speaking</h3>
              <p className="text-sm text-muted-foreground">Press "Start Voice" and ask your medical question naturally</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get AI Response</h3>
              <p className="text-sm text-muted-foreground">Receive intelligent answers both in text and spoken form</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm inline-block">
          <CardContent className="p-6">
            <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Ready to Try?</h3>
            <p className="text-muted-foreground mb-4">
              Click the AI assistant button in the bottom right corner to start your conversation!
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">AI Assistant Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Assistant Button */}
      <VoiceAssistantButton />
    </div>
  );
};

export default VoiceAssistantDemo;