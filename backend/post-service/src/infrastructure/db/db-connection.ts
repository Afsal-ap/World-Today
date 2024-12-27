import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);  
  }

  try {
    // Connecting to MongoDB without deprecated options
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);  
  }
};
