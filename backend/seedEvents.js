import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Import models
import Event from './models/Event.js';
import User from './models/User.js';

// Event data to seed (based on your mock data)
const eventsData = [
  {
    name: 'Induction 2025 – Your GDG Journey Begins',
    type: 'Meetup',
    description: 'Join us for the GDG MMMUT Induction 2025, where new members are welcomed into our vibrant tech community. Meet the team, discover upcoming events, and explore how you can learn, build, and collaborate with GDG On Campus MMMUT.',
    date: new Date('2025-06-15'),
    time: '10:00 AM - 1:00 PM',
    location: 'MMMUT Campus, Gorakhpur',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 250,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Induction', 'Community', 'Networking', 'Tech'],
    eventCategory: 'general'
  },
  {
    name: 'Google Cloud Skills Boost Arcade Program',
    type: 'Workshop',
    description: 'A gamified learning platform to build cloud computing skills through interactive labs, challenges, and trivia. Participants earn arcade points redeemable for Google swags.',
    date: new Date('2025-07-01'),
    time: '00:00 AM - 11:59 PM',
    location: 'Online (Google Cloud Skills Boost Arcade Platform)',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 500,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Cloud Computing', 'Skill Development', 'Gamified Learning'],
    eventCategory: 'general'
  },
  {
    name: "Developers' Summer of Code (DSoC - Cohort #1)",
    type: 'Hackathon',
    description: "A GSoC-styled open-source program focused on mentorship, project building, and real-world coding challenges.",
    date: new Date('2025-07-02'),
    time: '10:00 AM - 5:00 PM',
    location: 'Online (GitHub and Discord of GDG-MMMUT)',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 100,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Open Source', 'Coding', 'Mentorship'],
    eventCategory: 'general'
  },
  {
    name: 'The Call of the Community',
    type: 'Meetup',
    description: 'An introductory event to welcome first-year students to the GDG-MMMUT community.',
    date: new Date('2025-08-01'),
    time: '10:00 AM - 5:00 PM',
    location: 'Online (Social Media Platforms)',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 300,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Community Building', 'Orientation'],
    eventCategory: 'general'
  },
  {
    name: 'Orientation Session',
    type: 'Conference',
    description: 'An event to introduce GDG-MMMUT programs and activities to first-year students.',
    date: new Date('2025-08-15'),
    time: '2:00 PM - 5:00 PM',
    location: 'Multipurpose Hall, MMMUT Campus',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 200,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Orientation', 'Introductory Session'],
    eventCategory: 'general'
  },
  {
    name: 'DevXplore',
    type: 'Workshop',
    description: 'A series of roadmap sessions for domains like Web Development, AI/ML, and Blockchain.',
    date: new Date('2025-08-20'),
    time: '2:00 PM - 5:00 PM',
    location: 'Online (Microsoft Teams)',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 150,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Roadmap', 'Learning', 'Development'],
    eventCategory: 'general'
  },
  {
    name: 'Week of Geek',
    type: 'Tech Fest',
    description: 'A week-long event with domain-specific quizzes, webinars, and real-world project-building activities.',
    date: new Date('2025-08-23'),
    time: '10:00 AM - 5:00 PM',
    location: 'Hybrid (Online and MMMUT Campus)',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 400,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Skill Building', 'Projects'],
    eventCategory: 'general'
  },
  {
    name: 'Startup Bootcamp – University Edition',
    type: 'Conference',
    description: 'A three-day event focused on innovation and entrepreneurship, culminating in Demo Day.',
    date: new Date('2025-08-30'),
    time: '10:00 AM - 5:00 PM',
    location: 'Hybrid (MMMUT Campus and Online)',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 80,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Startup', 'Entrepreneurship'],
    eventCategory: 'general'
  },
  {
    name: 'Flutter Fusion',
    type: 'Workshop',
    description: 'A hands-on workshop for Flutter app development, followed by a competitive app-building round.',
    date: new Date('2025-09-20'),
    time: '10:00 AM - 4:00 PM',
    location: 'MMMUT Campus',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 60,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Mobile Development', 'Flutter'],
    eventCategory: 'general'
  },
  {
    name: 'NullTrace: Ops #0 - The Ghost Protocol',
    type: 'Hackathon',
    description: 'A cybersecurity event simulating real-world scenarios, including CTFs and live attack/defense challenges.',
    date: new Date('2025-09-28'),
    time: '10:00 AM - 6:00 PM',
    location: 'Hybrid (Online and MMMUT Campus)',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 50,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Cybersecurity', 'Hackathon'],
    eventCategory: 'general'
  },
  {
    name: 'Google Cloud Gen AI Study Jams October',
    type: 'Study Jam',
    description: 'An event focusing on Generative AI and Cloud Computing pathways, with labs and tasks to earn swags.',
    date: new Date('2025-10-01'),
    time: '00:00 AM - 11:59 PM',
    location: 'Online (Google Cloud Skills Boost Platform)',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 1000,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Generative AI', 'Cloud Computing'],
    eventCategory: 'study-jam'
  },
  {
    name: 'Immerse',
    type: 'Tech Fest',
    description: 'An introduction to immersive technologies like AR and VR, with hands-on sessions for creating immersive projects.',
    date: new Date('2025-10-10'),
    time: '10:00 AM - 5:00 PM',
    location: 'MMMUT Campus',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 100,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['AR', 'VR', 'Immersive Tech'],
    eventCategory: 'immerse'
  },
  {
    name: 'Build With AI',
    type: 'Workshop',
    description: 'A project-based event leveraging Google Cloud tools like Vertex AI and Gemini to build AI-enabled solutions.',
    date: new Date('2025-11-10'),
    time: '10:00 AM - 4:00 PM',
    location: 'MMMUT Campus',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 80,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['AI', 'Machine Learning', 'Google Cloud'],
    eventCategory: 'general'
  },
  {
    name: "Developers' Winter of Code (DWoC - Cohort #2)",
    type: 'Hackathon',
    description: 'A GSoC-styled open-source program focusing on mentorship and project development during winter.',
    date: new Date('2025-12-01'),
    time: '10:00 AM - 5:00 PM',
    location: 'Online (GitHub and Discord of GDG-MMMUT)',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 100,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Open Source', 'Coding', 'Mentorship'],
    eventCategory: 'general'
  },
  {
    name: 'HackBlitz',
    type: 'Hackathon',
    description: 'A 36-hour hackathon bringing together students from different campuses to innovate, collaborate, and build impactful solutions.',
    date: new Date('2025-12-15'),
    time: '9:00 AM - 9:00 PM (Day 1)',
    location: 'MMMUT Campus',
    image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    capacity: 150,
    registeredCount: 0,
    published: true,
    draft: false,
    registrationOpen: true,
    tags: ['Hackathon', 'Innovation', 'Collaboration'],
    eventCategory: 'hackblitz'
  }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');

    // Find an admin user to assign as creator
    console.log('\n🔍 Looking for admin user...');
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Try to find super_admin
      adminUser = await User.findOne({ role: 'super_admin' });
    }
    
    if (!adminUser) {
      // Try to find event_manager
      adminUser = await User.findOne({ role: 'event_manager' });
    }

    if (!adminUser) {
      // If still no admin, find any user
      adminUser = await User.findOne();
    }

    if (!adminUser) {
      console.error('❌ No users found in database. Please create an admin user first!');
      console.log('\n💡 You can create an admin user by:');
      console.log('   1. Signing up through the app');
      console.log('   2. Manually updating the user role in MongoDB to "admin"');
      process.exit(1);
    }

    console.log(`✅ Found user: ${adminUser.name} (${adminUser.email})`);
    console.log(`   Role: ${adminUser.role}`);

    // Check if events already exist
    console.log('\n🔍 Checking existing events...');
    const existingEventsCount = await Event.countDocuments();
    console.log(`   Found ${existingEventsCount} existing events`);

    // Ask user what to do
    console.log('\n📝 Seeding Options:');
    console.log('   1. Clear all events and insert fresh data (DESTRUCTIVE)');
    console.log('   2. Add new events only (keep existing)');
    console.log('   3. Update existing + add new events');
    
    // For automation, we'll use option 2 (add new only) by default
    const option = process.argv[2] || '2';
    
    if (option === '1') {
      console.log('\n🗑️  Clearing all existing events...');
      await Event.deleteMany({});
      console.log('✅ All events deleted');
    }

    // Add createdBy field to all events
    const eventsToInsert = eventsData.map(event => ({
      ...event,
      createdBy: adminUser._id
    }));

    if (option === '3') {
      console.log('\n🔄 Updating/Inserting events...');
      let updatedCount = 0;
      let insertedCount = 0;

      for (const eventData of eventsToInsert) {
        const existing = await Event.findOne({ name: eventData.name });
        if (existing) {
          await Event.findByIdAndUpdate(existing._id, eventData);
          updatedCount++;
          console.log(`   ✏️  Updated: ${eventData.name}`);
        } else {
          await Event.create(eventData);
          insertedCount++;
          console.log(`   ➕ Inserted: ${eventData.name}`);
        }
      }

      console.log(`\n✅ Seed completed: ${updatedCount} updated, ${insertedCount} inserted`);
    } else {
      // Option 1 or 2: Insert all
      console.log('\n➕ Inserting events into database...');
      const result = await Event.insertMany(eventsToInsert);
      console.log(`✅ Successfully inserted ${result.length} events!`);
    }

    // Show summary
    console.log('\n📊 Database Summary:');
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ published: true });
    const upcomingEvents = await Event.countDocuments({ 
      published: true, 
      date: { $gte: new Date() } 
    });

    console.log(`   Total Events: ${totalEvents}`);
    console.log(`   Published Events: ${publishedEvents}`);
    console.log(`   Upcoming Events: ${upcomingEvents}`);

    // List all events
    console.log('\n📋 Events in Database:');
    const allEvents = await Event.find().sort({ date: 1 }).select('name date type published');
    allEvents.forEach((event, index) => {
      const status = new Date(event.date) >= new Date() ? '🟢' : '🔴';
      const pub = event.published ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${pub} ${event.name}`);
      console.log(`      📅 ${event.date.toISOString().split('T')[0]} | ${event.type}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('✨ Your events are now ready to be displayed on the website!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the seed script
console.log('🌱 GDG MMMUT Event Database Seeder');
console.log('==================================\n');
seedDatabase();
