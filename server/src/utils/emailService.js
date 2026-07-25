import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = null;
    // Don't initialize in constructor - dotenv not loaded yet
    // Will be initialized lazily on first use
  }

  initializeTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass || user.includes('your_gmail')) {
      console.warn('⚠️  Gmail SMTP not configured. OTPs will show in console.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });

      this.transporter.verify((error) => {
        if (error) {
          console.error('❌ Gmail SMTP connection failed:', error.message);
          this.transporter = null;
        } else {
          console.log(`✅ Gmail SMTP ready → ${user}`);
        }
      });
    } catch (error) {
      console.error('Email transporter initialization failed:', error);
      this.transporter = null;
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      // Lazy initialize on first use (dotenv is loaded by now)
      if (!this.transporter) {
        this.initializeTransporter();
      }

      if (!this.transporter) {
        // Development mode - show OTP in console clearly
        const otpMatch = html.match(/<div class="otp-code">(\d{6})<\/div>/);
        const otp = otpMatch ? otpMatch[1] : 'N/A';
        console.log('\n' + '='.repeat(50));
        console.log('📧 EMAIL (Dev Mode - SMTP not configured)');
        console.log(`To      : ${to}`);
        console.log(`Subject : ${subject}`);
        if (otp !== 'N/A') console.log(`OTP CODE: ${otp}  ← Use this to login`);
        console.log('='.repeat(50) + '\n');
        return { success: true, messageId: `dev_${Date.now()}`, simulation: true };
      }

      const mailOptions = {
        from: `"HealthLock Hospital" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent to:', to, '| ID:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      // Fallback to simulation in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email Fallback Simulation');
        console.log(`To: ${to}, Subject: ${subject}`);
        return { success: true, messageId: `fallback_${Date.now()}`, simulation: true };
      }
      return { success: false, error: error.message };
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Email templates
  getWelcomeEmailTemplate(firstName, otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HealthLock</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 Welcome to HealthLock</h1>
            <p>Your trusted healthcare management system</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining HealthLock. To complete your registration and verify your email address, please use the verification code below:</p>
            
            <div class="otp-box">
              <p><strong>Your Verification Code:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>If you didn't create an account with HealthLock, please ignore this email.</p>
            
            <h3>What's Next?</h3>
            <ul>
              <li>✅ Verify your email address</li>
              <li>📱 Verify your phone number</li>
              <li>👤 Complete your profile</li>
              <li>🩺 Start using our medical services</li>
            </ul>
            
            <p>Need help? Contact our support team at <a href="mailto:support@healthlock.com">support@healthlock.com</a></p>
          </div>
          <div class="footer">
            <p>© 2024 HealthLock Hospital Management System</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getOTPEmailTemplate(firstName, otp, purpose = 'verification') {
    const purposes = {
      verification: 'Email Verification',
      login: 'Login Verification',
      password_reset: 'Password Reset'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${purposes[purpose]} - HealthLock</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 ${purposes[purpose]}</h1>
            <p>HealthLock Security Code</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>You requested a verification code for your HealthLock account. Please use the code below:</p>
            
            <div class="otp-box">
              <p><strong>Your Verification Code:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <p>If you didn't request this code, please ignore this email and consider changing your password.</p>
            </div>
            
            <p>For your security, never share this code with anyone. HealthLock staff will never ask for your verification code.</p>
          </div>
          <div class="footer">
            <p>© 2024 HealthLock Hospital Management System</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetEmailTemplate(firstName, resetLink) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - HealthLock</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset</h1>
            <p>HealthLock Account Recovery</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>You requested to reset your password for your HealthLock account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>© 2024 HealthLock Hospital Management System</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send welcome email with OTP
  async sendWelcomeEmail(email, firstName, otp) {
    const html = this.getWelcomeEmailTemplate(firstName, otp);
    return this.sendEmail(email, 'Welcome to HealthLock - Verify Your Email', html);
  }

  // Send OTP email
  async sendOTPEmail(email, firstName, otp, purpose = 'verification') {
    const html = this.getOTPEmailTemplate(firstName, otp, purpose);
    const subjects = {
      verification: 'Email Verification Code - HealthLock',
      login: 'Login Verification Code - HealthLock',
      password_reset: 'Password Reset Code - HealthLock'
    };
    return this.sendEmail(email, subjects[purpose], html);
  }

  // Send password reset email
  async sendPasswordResetEmail(email, firstName, resetLink) {
    const html = this.getPasswordResetEmailTemplate(firstName, resetLink);
    return this.sendEmail(email, 'Password Reset - HealthLock', html);
  }
}

export default new EmailService();