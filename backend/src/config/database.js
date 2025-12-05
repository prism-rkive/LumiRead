const config = require("./index");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.databaseUrl);  
    console.log(`MongoDB Connected: ${conn.connection.host}`);  
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;