// SMS Service using Twilio (you can replace with other SMS providers)
class SMSService {
  constructor() {
    // Initialize Twilio client if credentials are provided
    this.twilioClient = null;
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        // Uncomment when Twilio is installed
        // const twilio = require('twilio');
        // this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      } catch (error) {
        console.error('Twilio initialization failed:', error);
      }
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      // For development/testing, we'll simulate SMS sending
      if (process.env.NODE_ENV === 'development' || !this.twilioClient) {
        console.log(`📱 SMS Simulation - To: ${phoneNumber}, Message: ${message}`);
        return { 
          success: true, 
          messageId: `sim_${Date.now()}`,
          simulation: true 
        };
      }

      // Uncomment when Twilio is properly set up
      /*
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log('SMS sent successfully:', result.sid);
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
      console.error('SMS sending failed:', error);
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

    return this.sendSMS(formattedPhone, messages[purpose] || messages.verification);
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