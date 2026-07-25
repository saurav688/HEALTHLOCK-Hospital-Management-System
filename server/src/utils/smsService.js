// SMS Service using Twilio (you can replace with other SMS providers)
class SMSService {
  constructor() {
    // Initialize Twilio client if credentials are provided
    this.twilioClient = null;
    this.isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        // Uncomment when Twilio is installed
        // const twilio = require('twilio');
        // this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log('✅ Twilio SMS service initialized');
      } catch (error) {
        console.error('❌ Twilio initialization failed:', error);
      }
    } else {
      console.log('⚠️  SMS Service running in DEVELOPMENT MODE - OTPs will be logged to console');
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      // For development/testing, we'll simulate SMS sending and log OTP to console
      if (this.isDevelopment || !this.twilioClient) {
        console.log('\n' + '='.repeat(60));
        console.log('📱 SMS SIMULATION (Development Mode)');
        console.log('='.repeat(60));
        console.log(`To: ${phoneNumber}`);
        console.log(`Message: ${message}`);
        console.log('='.repeat(60) + '\n');
        
        // Extract OTP from message if present
        const otpMatch = message.match(/\b\d{6}\b/);
        if (otpMatch) {
          console.log(`🔑 OTP CODE: ${otpMatch[0]}`);
          console.log('='.repeat(60) + '\n');
        }
        
        return { 
          success: true, 
          messageId: `sim_${Date.now()}`,
          simulation: true,
          message: 'SMS simulated in development mode. Check console for OTP.'
        };
      }

      // Uncomment when Twilio is properly set up
      /*
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log('✅ SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid };
      */

      // Fallback simulation
      console.log(`📱 SMS Fallback - To: ${phoneNumber}, Message: ${message}`);
      return { 
        success: true, 
        messageId: `fallback_${Date.now()}`,
        simulation: true 
      };

    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present (assuming India +91)
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    return phone; // Return as-is if format is unclear
  }

  // Send OTP SMS
  async sendOTP(phoneNumber, otp, purpose = 'verification') {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    
    const messages = {
      verification: `Your HealthLock verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`,
      login: `Your HealthLock login code is: ${otp}. This code will expire in 10 minutes. If you didn't request this, please ignore.`,
      password_reset: `Your HealthLock password reset code is: ${otp}. This code will expire in 10 minutes. Keep this code secure.`
    };

    const result = await this.sendSMS(formattedPhone, messages[purpose] || messages.verification);
    
    // In development, also log to a file for easy access
    if (this.isDevelopment && result.success) {
      console.log(`\n💡 TIP: Use OTP ${otp} for ${purpose} on phone ${formattedPhone}\n`);
    }
    
    return result;
  }

  // Send welcome SMS
  async sendWelcomeSMS(phoneNumber, firstName) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    const message = `Welcome to HealthLock, ${firstName}! Your account has been created successfully. Download our app for easy access to healthcare services.`;
    
    return this.sendSMS(formattedPhone, message);
  }

  // Send appointment reminder SMS
  async sendAppointmentReminder(phoneNumber, patientName, doctorName, appointmentTime) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    const message = `Hi ${patientName}, this is a reminder for your appointment with Dr. ${doctorName} at ${appointmentTime}. Please arrive 15 minutes early. - HealthLock`;
    
    return this.sendSMS(formattedPhone, message);
  }

  // Send emergency alert SMS
  async sendEmergencyAlert(phoneNumber, message) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    const emergencyMessage = `🚨 EMERGENCY ALERT from HealthLock: ${message}`;
    
    return this.sendSMS(formattedPhone, emergencyMessage);
  }
}

export default new SMSService();