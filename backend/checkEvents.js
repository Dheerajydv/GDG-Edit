import 'dotenv/config';
import mongoose from 'mongoose';
import Event from './models/Event.js';

const checkEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all events
    const events = await Event.find({});
    console.log('\n📊 Total events in database:', events.length);

    if (events.length > 0) {
      console.log('\n📝 Events details:');
      events.forEach((event, index) => {
        console.log(`\n${index + 1}. ${event.name}`);
        console.log(`   - Type: ${event.type}`);
        console.log(`   - Published: ${event.published}`);
        console.log(`   - Draft: ${event.draft}`);
        console.log(`   - Category: ${event.eventCategory || 'N/A'}`);
        console.log(`   - Date: ${event.date}`);
        console.log(`   - Created: ${event.createdAt}`);
      });

      // Check published vs draft
      const publishedCount = events.filter(e => e.published).length;
      const draftCount = events.filter(e => e.draft).length;
      console.log(`\n📈 Summary:`);
      console.log(`   - Published: ${publishedCount}`);
      console.log(`   - Draft: ${draftCount}`);
      console.log(`   - Neither: ${events.length - publishedCount - draftCount}`);
    } else {
      console.log('\n⚠️ No events found in database!');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkEvents();
