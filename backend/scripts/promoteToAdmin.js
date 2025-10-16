// Promote user by email to admin
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';

const promoteToAdmin = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');

    const email = 'admin@gdg.com';
    const role = 'super_admin';

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log('📧 Current user:', user.email);
    console.log('🔑 Current role:', user.role);
    console.log('');

    user.role = role;
    user.emailVerified = true;
    await user.save({ validateBeforeSave: false });

    console.log('✅ User promoted successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 New Role:', user.role);
    console.log('\n🎉 You can now access the admin portal at /admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

promoteToAdmin();
