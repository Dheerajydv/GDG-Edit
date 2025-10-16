import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n🔧 SOLUTION: Add your IP to MongoDB Atlas whitelist:');
      console.error('   1. Go to https://cloud.mongodb.com/');
      console.error('   2. Select your cluster');
      console.error('   3. Click "Network Access" in the left sidebar');
      console.error('   4. Click "Add IP Address"');
      console.error('   5. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('   6. Or add your current IP address\n');
    }
    
    process.exit(1);
  }
};

export default connectDB;
