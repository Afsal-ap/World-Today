export interface RegisterChannelDTO {
    channelName: string;
    email: string;
    phoneNumber: string;
    governmentId: string;
    logo: {
      path: string;
      filename: string;
    };
    websiteOrSocialLink: string;
    password: string;
    isVerified?: boolean;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface RefreshTokenDTO {
    refreshToken: string;
  }
  
  export interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
  }
  