const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employer_dashboard');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('⚠️ Running server without active database connection. Start MongoDB on port 27017 or set a valid MONGODB_URI in your .env file to enable full data persistence.');
  }
};

module.exports = connectDB;
