import React, { useCallback, useRef, useState, memo } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import RegisterModal from '../components/RegisterForm';

// Styled Components
const EventsSectionContainer = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  position: relative;
  overflow: hidden;
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -0.5rem;
    height: 4px;
    width: 60px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const EventCardContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px ${({ theme }) => theme.colors.shadow};
  }
`;

const EventImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${EventCardContainer}:hover & img {
    transform: scale(1.05);
  }
`;

const EventBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case 'workshop':
        return theme.googleColors.blue.light;
      case 'hackathon':
        return theme.googleColors.red.light;
      case 'webinar':
        return theme.googleColors.green.light;
      case 'meetup':
        return theme.googleColors.yellow.light;
      default:
        return theme.colors.primary;
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'workshop':
        return theme.googleColors.blue.darker;
      case 'hackathon':
        return theme.googleColors.red.darker;
      case 'webinar':
        return theme.googleColors.green.darker;
      case 'meetup':
        return theme.googleColors.yellow.darker;
      default:
        return theme.colors.text.inverse;
    }
  }};
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EventInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EventDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const RegisterButton = styled(motion.button)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.name === 'light'
        ? theme.googleColors.blue.dark
        : theme.googleColors.blue.light};
  }
`;

// Dummy events data
const eventsData = [
  {
    id: 1,
    title: "Orientation 2025 – GDG MMMUT",
    type: "Event",
    date: "January 20, 2025",
    time: "11:00 AM - 1:00 PM",
    location: "Auditorium, MMMUT",
    capacity: "300+ students",
    description: "Kickstart your journey with GDG MMMUT! Meet the team, learn about our vision, explore exciting upcoming events, and discover how you can be part of our tech-driven community.",
    image: "https://ik.imagekit.io/guxtd3sah/IMG_0710.HEIC?updatedAt=1754648851818"
},
{
    id: 2,
    title: "Hackblitz",
    type: "Event",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "CS Department, MMMUT",
    capacity: "25 qualified teams",
    description: "A high-energy hackathon where innovators and problem-solvers collaborate to build impactful tech solutions for real-world challenges.",
    image: "https://ik.imagekit.io/vkajf4kza/IMG_0376.JPG?updatedAt=1754639902883"
},
{
    id: 3,
    title: "Web Development",
    type: "Workshop",
    date: "April 1-2, 2024",
    time: "3 days",
    location: "Online",
    capacity: "100 teams",
    description: "A beginner-friendly workshop introducing HTML, CSS, and JavaScript to help you start building interactive, responsive web applications.",
    image: "https://ik.imagekit.io/vkajf4kza/DSC_0238%20(1)_2.jpg?updatedAt=1754639916150"
},
{
    id: 4,
    title: "Machine Learning Webinar",
    type: "Webinar",
    date: "March 20, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Online",
    capacity: "200 participants",
    description: "An expert-led session exploring machine learning fundamentals, TensorFlow basics, and real-world AI applications.",
    image: "https://ik.imagekit.io/vkajf4kza/DSC_0190.JPG?updatedAt=1754639915604"
},
{
    id: 5,
    title: "App Development",
    type: "Workshop",
    date: "March 25, 2024",
    time: "5:00 PM - 7:00 PM",
    location: "Seminar Hall, MMMUT",
    capacity: "75 participants",
    description: "A hands-on workshop on creating mobile applications, covering UI/UX design, development, and deployment strategies.",
    image: "https://ik.imagekit.io/vkajf4kza/DSC_0428_1.webp?updatedAt=1754639910287"
},
{
    id: 6,
    title: "Native Nexus",
    type: "Workshop",
    date: "April 10, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Online",
    capacity: "250+ participants",
    description: "An immersive workshop focused on mastering Google Cloud Platform services and integrating them into real-world applications.",
    image: "https://ik.imagekit.io/vkajf4kza/DSC_0271_1.jpg?updatedAt=1754639914878"
}
];

// Memoized Subcomponents
const SectionHeader = () => (
  <SectionHeaderWrapper>
    <SectionTitle>Recent Events</SectionTitle>
    <SectionDescription>
      Join us for exciting events, workshops, and meetups. Learn from experts,
      network with peers, and stay updated with the latest in technology.
    </SectionDescription>
  </SectionHeaderWrapper>
);

const MemoizedSectionHeader = memo(SectionHeader);

const EventCard = ({ event, onRegister }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <EventCardContainer variants={itemVariants}>
      <EventImage>
        <img src={event.image} alt={event.title} />
        <EventBadge $type={event.type}>
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </EventBadge>
      </EventImage>
      <EventContent>
        <EventTitle>{event.title}</EventTitle>
        {/* <EventInfo>
          <FaCalendar />
          <span>{event.date}</span>
        </EventInfo>
        <EventInfo>
          <FaClock />
          <span>{event.time}</span>
        </EventInfo> */}
        <EventInfo>
          <FaMapMarkerAlt />
          <span>{event.location}</span>
        </EventInfo>
        <EventInfo>
          <FaUsers />
          <span>{event.capacity}</span>
        </EventInfo>
        <EventDescription>{event.description}</EventDescription>
        {/* <RegisterButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRegister(event)}
        >
          Register Now
        </RegisterButton> */}
      </EventContent>
    </EventCardContainer>
  );
};

const MemoizedEventCard = memo(EventCard);

// Main Component
export const PreviousEventsSection = () => {
  const [close, setClose] = useState(true);
  const [activeEvent, setActiveEvent] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const handleregister = useCallback((event) => {
    setActiveEvent(event);
    setClose(false);
  }, []);

  const handleModalClose = useCallback(() => {
    setClose(true);
  }, []);

  return (
    <>
      <EventsSectionContainer id="events" className="animate-section">
        <SectionContent ref={sectionRef}>
          <MemoizedSectionHeader />
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <EventsGrid>
              {eventsData.map((event) => (
                <MemoizedEventCard
                  key={event.id}
                  event={event}
                  onRegister={handleregister}
                />
              ))}
              
            </EventsGrid>
          </motion.div>
        </SectionContent>
      </EventsSectionContainer>
      {!close && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <RegisterModal event={activeEvent} onClose={handleModalClose} />
        </React.Suspense>
      )}
    </>
  );
};


