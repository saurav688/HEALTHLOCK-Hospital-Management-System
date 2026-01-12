import { OAuth2Client } from 'google-auth-library';

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Verify Google ID token
  async verifyIdToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      
      return {
        success: true,
        user: {
          googleId: payload.sub,
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          profilePicture: payload.picture,
          isEmailVerified: payload.email_verified
        }
      };
    } catch (error) {
      console.error('Google token verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate Google OAuth URL
  generateAuthUrl(state = null) {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
      prompt: 'consent'
    });

    return authUrl;
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    try {
      const { tokens } = await this.client.getToken(code);
      return {
        success: true,
        tokens: tokens
      };
    } catch (error) {
      console.error('Token exchange failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user info from access token
  async getUserInfo(accessToken) {
    try {
      this.client.setCredentials({ access_token: accessToken });
      
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userInfo = await userInfoResponse.json();
      
      return {
        success: true,
        user: {
          googleId: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          profilePicture: userInfo.picture,
          isEmailVerified: userInfo.verified_email
        }
      };
    } catch (error) {
      console.error('Failed to get user info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new GoogleAuthService();