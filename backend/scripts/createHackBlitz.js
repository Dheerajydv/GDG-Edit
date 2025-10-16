import mongoose from 'mongoose';
import Event from '../models/Event.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createHackBlitzEvent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find an admin user to be the creator
    const adminUser = await User.findOne({ role: 'super_admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    const hackBlitzEvent = {
      name: 'HackBlitz 2024',
      type: 'Hackathon',
      description: `Join HackBlitz 2024 - A thrilling 24-hour hackathon where innovation meets execution! 

🚀 **About the Event:**
HackBlitz is GDG MMMUT's flagship hackathon bringing together the brightest minds to solve real-world problems. Collaborate with your team, build innovative solutions, and compete for exciting prizes!

💡 **Theme:** Open Innovation - Build anything that creates impact
🏆 **Prizes Worth:** ₹1,50,000
👥 **Team Event:** 2-4 members per team
⏱️ **Duration:** 24 hours of non-stop coding

**Event Timeline:**
📅 Registration Opens: November 15, 2024
📅 Registration Deadline: December 1, 2024 (11:59 PM)
📅 Round 1 - PPT Submission: December 1-15, 2024
📅 Shortlisting Results: December 17, 2024
📅 Offline Hackathon: December 22-23, 2024 at MMMUT Gorakhpur

**Round 1: Idea Submission (Dec 1-15)**
- Submit your project idea
- Create a PPT presentation (max 10 slides)
- Explain problem statement, solution, and tech stack
- Teams will be shortlisted based on innovation and feasibility

**Round 2: 24-Hour Offline Hackathon (Dec 22-23)**
- Location: MMMUT Gorakhpur, Uttar Pradesh
- Duration: 24 hours of continuous coding
- Mentorship provided by industry experts
- Food and refreshments provided
- Final presentations to judges

**Team Requirements:**
- 2-4 members per team
- At least one member should be from MMMUT
- All members must be current students

**Prizes & Recognition:**
🥇 1st Prize: ₹50,000 + Certificates + Goodies
🥈 2nd Prize: ₹30,000 + Certificates + Goodies  
🥉 3rd Prize: ₹20,000 + Certificates + Goodies
🌟 Best Freshers Team: ₹15,000
💡 Best Innovation: ₹10,000
🎨 Best UI/UX: ₹10,000
🌍 Best Social Impact: ₹15,000

**What to Bring:**
- Laptop (mandatory)
- Chargers and extension cords
- College ID & Government ID
- Your creativity and enthusiasm!

Contact: hackblitz@gdgmmmut.com | +91 9876543210`,

      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      location: 'MMMUT Gorakhpur, Uttar Pradesh',
      date: new Date('2024-12-22T09:00:00'),
      time: '09:00 AM - December 23, 09:00 AM (24 hours)',
      capacity: 200,
      registrationDeadline: new Date('2024-12-01T23:59:59'),
      tags: ['hackathon', 'coding', 'innovation', 'tech', 'team-event', 'prizes'],
      createdBy: adminUser._id,
      published: true,
      registrationOpen: true,
      eventCategory: 'hackblitz'
    };

    // Check if event already exists
    const existingEvent = await Event.findOne({ name: 'HackBlitz 2024' });
    
    if (existingEvent) {
      console.log('⚠️  HackBlitz 2024 event already exists');
      console.log('Event ID:', existingEvent._id);
      console.log('\n💡 To update the event, delete it first and run this script again.');
      return;
    }

    const event = await Event.create(hackBlitzEvent);
    
    console.log('\n✅ HackBlitz 2024 event created successfully!');
    console.log('\n📋 Event Details:');
    console.log('Event ID:', event._id);
    console.log('Name:', event.name);
    console.log('Type:', event.type);
    console.log('Date:', event.date.toLocaleString());
    console.log('Location:', event.location);
    console.log('Registration Deadline:', event.registrationDeadline.toLocaleString());
    console.log('Capacity:', event.capacity, 'participants');
    console.log('Published:', event.published ? 'Yes ✅' : 'No ❌');
    console.log('Registration Open:', event.registrationOpen ? 'Yes ✅' : 'No ❌');
    console.log('\n🎉 Event is now live and ready for registrations!');
    console.log('🔗 View at: http://localhost:5173/events');
    console.log('🔗 Admin Panel: http://localhost:5173/admin/events');
    
  } catch (error) {
    console.error('❌ Error creating event:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createHackBlitzEvent();
