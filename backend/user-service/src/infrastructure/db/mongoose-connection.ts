import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) { 
        console.log("mongo string", process.env.MONGODB_URI);
          
        console.log('MongoDB connection error:', error);
    }
};

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'canceled'],
        default: 'inactive',
    },
});

export const UserModel = mongoose.model('User', UserSchema);





