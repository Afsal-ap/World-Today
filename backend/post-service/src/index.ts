import express from 'express';
import { connectToDatabase } from './infrastructure/db/db-connection';
import postRoutes from './interfaces/routes/PostRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
   
    await connectToDatabase();

   
    app.use('/api/posts', postRoutes);

    // Start the server
    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);  
  }
};

// Start the application
startServer();
