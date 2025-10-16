import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import "./EventHeader.css";
// Styled animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

// Background wrapper
const HeaderWrapper = styled.div`
  position: relative;
  overflow: hidden;

  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Background overlay image
const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-position: center;
  opacity: 0.5;
`;

// Floating circles
const FloatingCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(25px);
  animation: ${float} 6s ease-in-out infinite;
  opacity: 0.6;
`;

// Inner container
const Content = styled.div`
  position: relative;
  max-width: 900px;
  padding: 60px 20px;
  text-align: center;
  color: black
`;

// Countdown pill
const Countdown = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

// Title
const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -1px;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

// Description
const Description = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

// Info cards grid
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Single info card
const InfoCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 500;
  transition: 0.3s ease all;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }

  svg {
    margin-right: 10px;
    flex-shrink: 0;
  }
`;
const EventHeader = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const eventDate = new Date(`${event.date} ${event.time}`);

    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m`);
        }
      } else {
        setTimeLeft("Event started");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [event.date, event.time]);

  const spotsLeft = event.max_attendees - event.current_attendees;

  return (
    <HeaderWrapper>
      <BackgroundImage />

      {/* Floating Google-color accents */}
      <FloatingCircle style={{ top: "15%", left: "10%", width: 90, height: 90, background: "rgba(234, 67, 53, 0.3)" }} />
      <FloatingCircle style={{ top: "30%", right: "15%", width: 70, height: 70, background: "rgba(251, 188, 5, 0.3)", animationDelay: "2s" }} />
      <FloatingCircle style={{ bottom: "15%", left: "30%", width: 60, height: 60, background: "rgba(52, 168, 83, 0.3)", animationDelay: "4s" }} />

      <Content>
        <Countdown>
          <Clock size={16} style={{ marginRight: 8 }} /> {timeLeft}
        </Countdown>

        <Title className="htext">{event.title}</Title>

        <Description>{event.description}</Description>

        <InfoGrid>
          <InfoCard>
            <Calendar size={20} /> {event.date}
          </InfoCard>
          <InfoCard>
            <MapPin size={20} /> {event.location}
          </InfoCard>
          <InfoCard>
            <Users size={20} /> {spotsLeft} spots left
          </InfoCard>
        </InfoGrid>
      </Content>
    </HeaderWrapper>
  );
};
export default EventHeader;