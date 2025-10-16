import React from 'react';
import styled, { keyframes } from 'styled-components';
import EventCard from './EventCard';
import { motion } from 'framer-motion';

// Keyframes for loading dots animation
const fadeUp = keyframes`
  0%, 100% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  animation: ${fadeUp} 1.5s infinite;
`;

const EmptyStateContainer = styled(motion.div)`
  text-align: center;
  padding: 4rem 0; /* py-16 */
  background-color: ${({ theme }) => theme.bg};
  border-radius: 1rem; /* rounded-xl */
`;

const Title = styled.h3`
  font-size: 1.25rem; /* text-xl */
  font-weight: 500; /* font-medium */
  color: ${({ theme }) => theme.text};
`;

const Subtitle = styled.p`
  margin-top: 0.5rem; /* mt-2 */
  color: ${({ theme }) => theme.subtext};
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* grid-cols-1 */
  gap: 1.5rem; /* gap-6 */
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
`;

const MotionEventCard = styled(motion.div)``;

// Component
const EventsList = ({ events, isLoading,setclose }) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingDots>
          <LoadingDot color="#2563eb" />
          <LoadingDot color="#f43f5e" />
          <LoadingDot color="#f59e0b" />
        </LoadingDots>
      </LoadingContainer>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyStateContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title>No events found</Title>
        <Subtitle>Try changing your filters or check back later.</Subtitle>
      </EmptyStateContainer>
    );
  }

  return (
    <EventsGrid>
      {events.map((event, index) => (
        <MotionEventCard
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <EventCard event={event} setclose={setclose} />
        </MotionEventCard>
      ))}
    </EventsGrid>
  );
};

export default EventsList;
