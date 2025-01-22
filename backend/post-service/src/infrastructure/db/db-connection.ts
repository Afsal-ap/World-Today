import mongoose from 'mongoose';
import dotenv from 'dotenv'; 

dotenv.config();

export const connectToDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);  
  }
   
  try {
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);  
  }
};
