// This is a mock service to simulate fetching events from an API
export const fetchEvents = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock data
  return [
    {
      id: '16',
      title: 'Induction 2025 – Your GDG Journey Begins',
      description: 'Join us for the GDG MMMUT Induction 2025, where new members are welcomed into our vibrant tech community. Meet the team, discover upcoming events, and explore how you can learn, build, and collaborate with GDG On Campus MMMUT.',
      date: '2025-06-15',
      time: '10:00 AM - 1:00 PM',
      location: 'MMMUT Campus, Gorakhpur',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      status: 'upcoming',
      tags: ['Induction', 'Community', 'Networking', 'Tech'],
      attendees: 250,
    },
    {
      id: "1",
      title: "Google Cloud Skills Boost Arcade Program",
      description: "A gamified learning platform to build cloud computing skills through interactive labs, challenges, and trivia. Participants earn arcade points redeemable for Google swags.",
      date: "2025-07-01",
      time: "00:00 AM - 11:59 PM",
      location: "Online (Google Cloud Skills Boost Arcade Platform)",
      image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      tags: ["Cloud Computing", "Skill Development", "Gamified Learning"],
      status: "upcoming"
    },
    {
      id: "2",
      title: "Developers’ Summer of Code (DSoC - Cohort #1)",
      description: "A GSoC-styled open-source program focused on mentorship, project building, and real-world coding challenges.",
      date: "2025-07-02",
      time: "10:00 AM - 5:00 PM",
      location: "Online (GitHub and Discord of GDG-MMMUT)",
      tags: ["Open Source", "Coding", "Mentorship"],
      status: "upcoming"
    },
    {
      id: "3",
      title: "The Call of the Community",
      description: "An introductory event to welcome first-year students to the GDG-MMMUT community.",
      date: "2025-08-01 ",
      time: "10:00 AM - 5:00 PM",
      location: "Online (Social Media Platforms)",
      tags: ["Community Building", "Orientation"],
      status: "upcoming"
    },
    {
      id: "4",
      title: "Orientation Session",
      description: "An event to introduce GDG-MMMUT programs and activities to first-year students.",
      date: "2025-08-15 ",
      time: "2:00 PM - 5:00 PM",
      location: "Multipurpose Hall, MMMUT Campus",
      tags: ["Orientation", "Introductory Session"],
      status: "upcoming"
    },
    {
      id: "5",
      title: "DevXplore",
      description: "A series of roadmap sessions for domains like Web Development, AI/ML, and Blockchain.",
      date: "2025-08-20 ",
      time: "2:00 PM - 5:00 PM",
      location: "Online (Microsoft Teams)",
      tags: ["Roadmap", "Learning", "Development"],
      status: "upcoming"
    },
    {
      id: "6",
      title: "Week of Geek",
      description: "A week-long event with domain-specific quizzes, webinars, and real-world project-building activities.",
      date: "2025-08-23 ",
      time: "10:00 AM - 5:00 PM",
      location: "Hybrid (Online and MMMUT Campus)",
      tags: ["Skill Building", "Projects"],
      status: "upcoming"
    },
    {
      id: "7",
      title: "Startup Bootcamp – University Edition",
      description: "A three-day event focused on innovation and entrepreneurship, culminating in Demo Day.",
      date: "2025-08-30 ",
      time: "10:00 AM - 5:00 PM",
      location: "Hybrid (MMMUT Campus and Online)",
      tags: ["Startup", "Entrepreneurship"],
      status: "upcoming"
    },
    {
      id: "8",
      title: "Flutter Fusion",
      description: "A hands-on workshop for Flutter app development, followed by a competitive app-building round.",
      date: "2025-09-20 ",
      time: "10:00 AM - 4:00 PM",
      image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      location: "MMMUT Campus",
      tags: ["Mobile Development", "Flutter"],
      status: "upcoming"
    },
    {
      id: "9",
      title: "NullTrace: Ops #0 - The Ghost Protocol",
      description: "A cybersecurity event simulating real-world scenarios, including CTFs and live attack/defense challenges.",
      date: "2025-09-28 ",
      time: "Varies",
      location: "Hybrid (Online and MMMUT Campus)",
      tags: ["Cybersecurity", "Hackathon"],
      status: "upcoming"
    },
    {
      id: "10",
      title: "Google Cloud Gen AI Study Jams October",
      description: "An event focusing on Generative AI and Cloud Computing pathways, with labs and tasks to earn swags.",
      date: "2025-10-01 ",
      time: "00:00 AM - 11:59 PM",
      location: "Online (Google Cloud Skills Boost Platform)",
      tags: ["Generative AI", "Cloud Computing"],
      status: "upcoming"
    },
    {
      id: "11",
      title: "Build With AI",
      description: "A project-based event leveraging Google Cloud tools like Vertex AI and Gemini to build AI-enabled solutions.",
      date: "2025-11-10 ",
      time: "10:00 AM - 4:00 PM",
      location: "MMMUT Campus",
      tags: ["AI", "Machine Learning", "Google Cloud"],
      status: "upcoming"
    },
    {
      id: "12",
      title: "Immerse",
      description: "An introduction to immersive technologies like AR and VR, with hands-on sessions for creating immersive projects.",
      date: "2025-10-10 ",
      time: "10:00 AM - 5:00 PM",
      location: "MMMUT Campus",
      tags: ["AR", "VR", "Immersive Tech"],
      status: "upcoming"
    },
    {
      id: "13",
      title: "Developers’ Winter of Code (DWoC - Cohort #2)",
      description: "A GSoC-styled open-source program focusing on mentorship and project development during winter.",
      date: "2025-08-01 ",
      time: "10:00 AM - 5:00 PM",
      location: "Online (GitHub and Discord of GDG-MMMUT)",
      tags: ["Open Source", "Coding", "Mentorship"],
      status: "upcoming"
    },
    {
      id: "14",
      title: "FrontFlow",
      description: "A workshop and competition focusing on foundational and advanced front-end web development.",
      date: "2025-09-01 ",
      time: "10:00 AM - 5:00 PM",
      location: "Pushpagiri Lecture Hall Complex, MMMUT",
      tags: ["Web Development", "Frontend"],
      status: "upcoming"
    },
    {
      id: "15",
      title: "BlockBuilders",
      description: "An event exploring blockchain development, including fundamentals, smart contracts, and real-world applications.",
      date: "2025-09-08 ",
      time: "10:00 AM - 5:00 PM",
      location: "MMMUT Campus",
      tags: ["Blockchain", "Development", "Web 3.0"],
      image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      status: "upcoming"
    },

  ];
};