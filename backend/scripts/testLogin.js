// Test login credentials
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';

const testLogin = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');

    const email = 'admin@gdg.com';
    const password = 'admin@123';

    console.log('🧪 Testing login credentials...');
    console.log('📧 Email:', email);
    console.log('🔐 Password:', password);
    console.log('');

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found');
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('📧 Email verified:', user.emailVerified);
    console.log('🔒 Has password:', !!user.password);
    console.log('');

    // Test password
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('✅✅✅ PASSWORD CORRECT! ✅✅✅');
      console.log('\nYou can now login with:');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('❌❌❌ PASSWORD INCORRECT! ❌❌❌');
      console.log('\nTrying to reset password...');
      
      user.password = password;
      await user.save();
      
      // Test again
      const userUpdated = await User.findOne({ email }).select('+password');
      const isMatchNow = await userUpdated.comparePassword(password);
      
      if (isMatchNow) {
        console.log('✅ Password reset successful!');
        console.log('You can now login with:');
        console.log('Email:', email);
        console.log('Password:', password);
      } else {
        console.log('❌ Password reset failed!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testLogin();
