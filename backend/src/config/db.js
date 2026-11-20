import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (!config.mongoUri || config.mongoUri.trim() === '') {
    console.log('ℹ️ [MongoDB] No MONGODB_URI specified. Operating in High-Performance Local In-Memory / File-Persisted Fallback Mode.');
    isConnected = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Connection failed: ${error.message}. Falling back to Local Persistence Store.`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnected,
    mode: isConnected ? 'mongodb-atlas' : 'local-in-memory',
    state: mongoose.connection.readyState,
  };
};

export { isConnected };
