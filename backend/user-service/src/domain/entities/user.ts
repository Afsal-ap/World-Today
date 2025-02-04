export interface IUser {
    id?: string;
    email: string;
    password?: string;
    name: string;
    phone: string;
    isAdmin?: boolean;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User implements IUser {
    id?: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    isAdmin: boolean;
    isBlocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.password = user.password || '';
        this.name = user.name;
        this.phone = user.phone;
        this.isAdmin = Boolean(user.isAdmin);
        this.isBlocked = Boolean(user.isBlocked);
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }

    validate(): boolean {
        if (this.password) {
            return this.email.includes('@') && 
                   this.password.length >= 8 && 
                   this.name.length > 0 &&
                   this.phone.length > 0;
        }
        return this.email.includes('@') && 
               this.name.length > 0 &&
               this.phone.length > 0;
    }
}
