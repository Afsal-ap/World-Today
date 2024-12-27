export interface Advertiser {
    id?: string;
    companyName: string;
    contactPersonName: string;
    email: string;
    phoneNumber: string;
    password: string;
    refreshToken?: string;
    isVerified?: boolean;
} 