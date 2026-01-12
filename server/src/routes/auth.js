import express from "express";
import User from "../models/User.js";
import { 
  generateToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  authenticate 
} from "../middleware/auth.js";
import {
  authLimiter,
  otpLimiter,
  passwordResetLimiter,
  loginLimiter,
  registrationLimiter
} from "../middleware/rateLimiter.js";
import emailService from "../utils/emailService.js";
import smsService from "../utils/smsService.js";
import googleAuthService from "../utils/googleAuth.js";
import crypto from "crypto";

const router = express.Router();

// Register with email and password
router.post("/register", registrationLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role = 'patient' } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? "Email already registered" : "Phone number already registered"
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role
    });

    // Generate email OTP
    const emailOTP = user.setEmailOTP();
    
    // Generate phone OTP
    const phoneOTP = user.setPhoneOTP();

    await user.save();

    // Send welcome email with OTP
    const emailResult = await emailService.sendWelcomeEmail(email, firstName, emailOTP);
    
    // Send SMS OTP
    const smsResult = await smsService.sendOTP(phone, phoneOTP, 'verification');

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email and phone number.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        },
        tokens: {
          accessToken,
          refreshToken
        },
        verification: {
          emailSent: emailResult.success,
          smsSent: smsResult.success
        }
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again."
    });
  }
});

// Login with email/phone and password
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and password are required"
      });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked due to too many failed login attempts. Please try again later."
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          profilePicture: user.profilePicture
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again."
    });
  }
});

// Google OAuth login
router.post("/google", authLimiter, async (req, res) => {
  try {
    const { idToken, phone } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required"
      });
    }

    // Verify Google token
    const googleResult = await googleAuthService.verifyIdToken(idToken);
    
    if (!googleResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token"
      });
    }

    const googleUser = googleResult.user;

    // Check if user exists
    let user = await User.findOne({
      $or: [
        { googleId: googleUser.googleId },
        { email: googleUser.email }
      ]
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
      }
      
      // Update profile picture if not set
      if (!user.profilePicture && googleUser.profilePicture) {
        user.profilePicture = googleUser.profilePicture;
      }

      // Mark email as verified if Google says it's verified
      if (googleUser.isEmailVerified && !user.isEmailVerified) {
        user.isEmailVerified = true;
      }

      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for new Google accounts"
        });
      }

      // Check if phone is already registered
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered with another account"
        });
      }

      user = new User({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        phone: phone,
        googleId: googleUser.googleId,
        profilePicture: googleUser.profilePicture,
        isEmailVerified: googleUser.isEmailVerified,
        role: 'patient'
      });

      // Generate phone OTP for verification
      const phoneOTP = user.setPhoneOTP();
      await user.save();

      // Send SMS OTP
      const smsResult = await smsService.sendOTP(phone, phoneOTP, 'verification');

      // Send welcome SMS
      await smsService.sendWelcomeSMS(phone, user.firstName);
    }

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: user.isNew ? "Account created successfully with Google" : "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          profilePicture: user.profilePicture
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: "Google login failed. Please try again."
    });
  }
});

// Phone OTP login (passwordless)
router.post("/phone-login", loginLimiter, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number"
      });
    }

    // Generate phone OTP
    const phoneOTP = user.setPhoneOTP();
    await user.save();

    // Send SMS OTP
    const smsResult = await smsService.sendOTP(phone, phoneOTP, 'login');

    res.json({
      success: true,
      message: "OTP sent to your phone number",
      data: {
        otpSent: smsResult.success,
        expiresIn: 600 // 10 minutes
      }
    });

  } catch (error) {
    console.error("Phone login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again."
    });
  }
});

// Verify phone OTP for login
router.post("/verify-phone-login", authLimiter, async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyPhoneOTP(otp);

    if (!isOTPValid) {
      await user.save(); // Save the incremented attempts
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          profilePicture: user.profilePicture
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error("Phone OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again."
    });
  }
});

// Verify email OTP
router.post("/verify-email", authenticate, otpLimiter, async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required"
      });
    }

    const user = req.user;

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyEmailOTP(otp);

    if (!isOTPValid) {
      await user.save(); // Save the incremented attempts
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed. Please try again."
    });
  }
});

// Verify phone OTP
router.post("/verify-phone", authenticate, otpLimiter, async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required"
      });
    }

    const user = req.user;

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: "Phone is already verified"
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyPhoneOTP(otp);

    if (!isOTPValid) {
      await user.save(); // Save the incremented attempts
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Phone verified successfully",
      data: {
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error("Phone verification error:", error);
    res.status(500).json({
      success: false,
      message: "Phone verification failed. Please try again."
    });
  }
});

// Resend email OTP
router.post("/resend-email-otp", authenticate, otpLimiter, async (req, res) => {
  try {
    const user = req.user;

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    // Generate new OTP
    const emailOTP = user.setEmailOTP();
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(user.email, user.firstName, emailOTP, 'verification');

    res.json({
      success: true,
      message: "OTP sent to your email",
      data: {
        otpSent: emailResult.success,
        expiresIn: 600 // 10 minutes
      }
    });

  } catch (error) {
    console.error("Resend email OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again."
    });
  }
});

// Resend phone OTP
router.post("/resend-phone-otp", authenticate, otpLimiter, async (req, res) => {
  try {
    const user = req.user;

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: "Phone is already verified"
      });
    }

    // Generate new OTP
    const phoneOTP = user.setPhoneOTP();
    await user.save();

    // Send SMS OTP
    const smsResult = await smsService.sendOTP(user.phone, phoneOTP, 'verification');

    res.json({
      success: true,
      message: "OTP sent to your phone",
      data: {
        otpSent: smsResult.success,
        expiresIn: 600 // 10 minutes
      }
    });

  } catch (error) {
    console.error("Resend phone OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again."
    });
  }
});

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        return res.status(400).json({
          success: false,
          message: "Invalid token type"
        });
      }

      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User not found or inactive"
        });
      }

      // Generate new tokens
      const newAccessToken = generateToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed"
    });
  }
});

// Get current user profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          profilePicture: user.profilePicture,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile"
    });
  }
});

// Logout (client-side token removal, server-side could implement token blacklisting)
router.post("/logout", authenticate, async (req, res) => {
  try {
    // In a more sophisticated implementation, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    
    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
});

export default router;