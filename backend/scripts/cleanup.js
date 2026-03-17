const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/drone-logistics');
    console.log('MongoDB Connected for cleanup...');

    // Option 1: Delete users with null username
    const result = await User.deleteMany({ 
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: "" }
      ]
    });
    
    console.log(`Cleanup complete. Removed ${result.deletedCount} invalid user records.`);
    
    // Optional: Clear all users if specifically requested or if issues persist
    // await User.deleteMany({});
    // console.log('All user records cleared.');

    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err.message);
    process.exit(1);
  }
};

cleanupDatabase();
