export interface Channel {
    id?: string;
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
    refreshToken?: string;
    isVerified?: boolean;
    bio?: string;
}
  