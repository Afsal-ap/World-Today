export interface RegisterUserDto {
    email: string;
    password: string;
    name: string;
    phone: string;
} 
   

export interface VerifyOtpDto {
    phone: string;
    otp: string;

}

export interface LoginUserDto {
    email: string;
    password: string;
}
    

export interface UserResponseDto {
    id: string;
    email: string;
    name: string;
    phone: string;
    createdAt: Date;
    isBlocked: boolean;
}

export interface AuthResponseDto {
    user: UserResponseDto;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface RefreshTokenDto {
    refreshToken: string;
}
