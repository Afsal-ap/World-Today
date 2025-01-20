export interface AdminUserListResponseDto {
    users: {
        id: string;
        email: string;
        name: string;
        phone: string;
        isAdmin: boolean;
        createdAt: Date;
    }[];
    total: number;
    page: number;
    limit: number;
}

export interface UpdateUserStatusDto {
    userId: string;
    isAdmin: boolean;
} 