# SMS OTP & Google Sign-In Setup Guide

## 🎯 Current Status

### ✅ What's Working NOW (Development Mode):
- **SMS OTP**: Working in SIMULATION mode - OTPs are displayed in the server console
- **Google Sign-In**: Ready to configure (instructions below)
- **Email/Password Login**: Fully functional
- **All other authentication features**: Working perfectly

### 📱 SMS OTP - Development Mode

**How it works RIGHT NOW:**

When you request an OTP (for login or verification), the system will:
1. Generate a 6-digit OTP code
2. **Display it in the server console** (terminal where `npm run server` is running)
3. Show a success message to the user
4. You can then use that OTP code to complete the verification

**Example Console Output:**
```
============================================================
📱 SMS SIMULATION (Development Mode)
============================================================
To: +919876543210
Message: Your HealthLock login code is: 123456. This code will expire in 10 minutes.
============================================================

🔑 OTP CODE: 123456
============================================================
```

**How to use it:**
1. Click "Send OTP" in the app
2. Check your server console (terminal)
3. Copy the 6-digit OTP code
4. Paste it in the verification form
5. Done! ✅

---

## 🚀 Production Setup (Real SMS)

### Option 1: Twilio (Recommended)

**Step 1: Create Twilio Account**
1. Go to https://www.twilio.com/
2. Sign up for a free account
3. Get $15 free credit for testing

**Step 2: Get Credentials**
1. Go to Twilio Console
2. Copy your:
   - Account SID
   - Auth Token
3. Get a Twilio phone number (from Console)

**Step 3: Configure Environment**

Add to `server/.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
NODE_ENV=production
```

**Step 4: Install Twilio Package**
```bash
cd server
npm install twilio
```

**Step 5: Enable Twilio in Code**

In `server/src/utils/smsService.js`, uncomment these lines:
```javascript
// Line 8-9: Uncomment
const twilio = require('twilio');
this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Line 42-49: Uncomment
const result = await this.twilioClient.messages.create({
  body: message,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phoneNumber
});

console.log('✅ SMS sent successfully:', result.sid);
return { success: true, messageId: result.sid };
```

**Step 6: Restart Server**
```bash
npm run server
```

### Option 2: Other SMS Providers

You can also use:
- **AWS SNS** (Amazon)
- **MessageBird**
- **Nexmo/Vonage**
- **Plivo**

Just replace the Twilio implementation in `smsService.js` with your provider's SDK.

---

## 🔐 Google Sign-In Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Create Project" or select existing project
3. Name it "HealthLock" or your preferred name

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: HealthLock Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:8080
     http://localhost:5173
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:8080/auth/google/callback
     http://localhost:5173/auth/google/callback
     ```
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### Step 4: Configure Frontend

Create `.env` file in the **root directory** (not in server folder):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### Step 5: Configure Backend

Add to `server/.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback
```

### Step 6: Restart Both Servers

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Step 7: Test Google Sign-In

1. Go to the login page
2. Click "Continue with Google"
3. Select your Google account
4. Enter phone number when prompted
5. Complete verification
6. Done! ✅

---

## 🧪 Testing Guide

### Test SMS OTP (Development Mode)

1. **Start the server:**
   ```bash
   npm run server
   ```

2. **Go to login page** and click "OTP Login" tab

3. **Enter any phone number** (format: +919876543210 or 9876543210)

4. **Click "Send OTP"**

5. **Check server console** - you'll see:
   ```
   🔑 OTP CODE: 123456
   ```

6. **Enter the OTP** in the verification form

7. **Click "Verify Code"**

8. **Success!** You're logged in

### Test Google Sign-In (After Setup)

1. **Configure Google OAuth** (follow steps above)

2. **Restart servers**

3. **Go to login page**

4. **Click "Continue with Google"**

5. **Select Google account**

6. **Enter phone number** when prompted

7. **Complete verification**

8. **Success!** You're logged in with Google

---

## 📊 Feature Comparison

| Feature | Development Mode | Production Mode |
|---------|-----------------|-----------------|
| **SMS OTP** | ✅ Console logging | ✅ Real SMS via Twilio |
| **Google Sign-In** | ⚙️ Needs setup | ✅ Full OAuth flow |
| **Email/Password** | ✅ Working | ✅ Working |
| **Email Verification** | ✅ Console logging | ✅ Real emails |
| **Security** | ✅ Full security | ✅ Full security |

---

## 🎓 Quick Start (No Setup Required)

**Want to test RIGHT NOW without any setup?**

1. Start the server:
   ```bash
   npm run server
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Go to http://localhost:8080/auth

4. **For Email/Password Login:**
   - Click "Sign up here"
   - Fill in the form
   - Click "Create Account"
   - Done! ✅

5. **For OTP Login:**
   - Click "OTP Login" tab
   - Enter phone: +919876543210
   - Click "Send OTP"
   - **Check server console for OTP**
   - Enter the OTP
   - Done! ✅

---

## 🐛 Troubleshooting

### SMS OTP not showing in console?

**Check:**
1. Server is running (`npm run server`)
2. Look for the SMS simulation box in console
3. Scroll up if needed - OTP is logged when you click "Send OTP"

### Google Sign-In not working?

**Check:**
1. `.env` file exists in root directory
2. `VITE_GOOGLE_CLIENT_ID` is set correctly
3. Both servers restarted after adding .env
4. Google Cloud Console credentials are correct
5. Authorized origins include your localhost URL

### "Phone number required" error?

**Solution:**
- Google Sign-In requires a phone number for new accounts
- Enter your phone number when prompted
- This is for account security and verification

---

## 💡 Pro Tips

1. **Development Mode is Perfect for Testing**
   - No need to set up Twilio immediately
   - OTPs in console are faster for development
   - Save money on SMS credits

2. **Set Up Google Sign-In First**
   - It's free and easy to configure
   - Provides better user experience
   - No SMS costs

3. **Production Checklist**
   - ✅ Set up Twilio for real SMS
   - ✅ Configure Google OAuth
   - ✅ Set NODE_ENV=production
   - ✅ Use real email service (not console)
   - ✅ Add proper error logging

---

## 📞 Need Help?

If you encounter issues:
1. Check server console for errors
2. Check browser console (F12)
3. Verify .env files are configured
4. Make sure both servers are running
5. Try the development mode first (no setup needed)

---

## ✨ Summary

**Current Status:**
- ✅ SMS OTP works in development (console logging)
- ⚙️ Google Sign-In ready to configure
- ✅ Email/Password fully functional
- ✅ All security features working

**To Enable Real SMS:**
- Sign up for Twilio
- Add credentials to .env
- Uncomment Twilio code
- Restart server

**To Enable Google Sign-In:**
- Create Google Cloud project
- Get OAuth credentials
- Add to .env files
- Restart servers

**No Setup Needed:**
- Use development mode
- OTPs show in console
- Perfect for testing!
