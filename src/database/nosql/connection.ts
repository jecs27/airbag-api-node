import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * The function `connectDB` connects to a MongoDB database using the provided URI or a default local
 * URI.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/airbag_db';
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
