import React, { useState } from "react";
import { Calendar, Clock, MapPin, ExternalLink, Users, Tag } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useAuth } from "../../contexts/useAuth";

const Card = styled(motion.div)`
  overflow: hidden;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.background.primary || "#fff"};
  box-shadow: ${({ theme }) => theme.colors.shadows.medium || "0 1px 3px rgba(0,0,0,0.1)"};
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 12rem;
  overflow: hidden;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
  &:hover {
    transform: scale(1.05);
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text.primary || "#ffffff"};
  backdrop-filter: blur(2px);
`;

const StatusBadge = styled.span`
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background-color: ${({ status }) =>
    status === "upcoming" ? "#22c55e" : "#ef4444"};
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const ContentWrapper = styled.div`
  padding: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary || "#4b5563"};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text.primary || "#374151"};
  margin-top: 1rem;
`;

const TagsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background-color: ${({ theme }) => theme.colors.background.secondary || "#f3f4f6"};
  color: ${({ theme }) => theme.colors.text.secondary || "#1f2937"};
  border-radius: 9999px;
`;

const Attendees = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textSecondary || "#6b7280"};
  font-size: 0.875rem;
`;

const RegisterButton = styled.button`
  margin-top: 1rem;
  background-color: #3b82f6;
  color: ${({ theme }) => theme.colors.text.primary || "#ffffff"};
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2563eb;
  }
`;

const ToggleButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary || "#374151"};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
     color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const EventCard = ({ event,setclose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {onEvent,activeEvent} = useAuth();
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const cardVariants = {
    collapsed: { height: "auto" },
    expanded: { height: "auto" },
  };

  const contentVariants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: { opacity: 1, height: "auto" },
  };
  function handleClick(){
    onEvent(event);
    setclose(false);
    console.log("activeEvent",activeEvent);
  }
  return (
    <Card
      variants={cardVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3 }}
    >
      <ImageWrapper onClick={toggleExpand}>
        <Image src={event.image} alt={event.title} />
        <GradientOverlay>
          <div>
            <StatusBadge status={event.status}>
              {event.status === "upcoming" ? "Upcoming" : "Past"}
            </StatusBadge>
            <Title>{event.title}</Title>
          </div>
        </GradientOverlay>
      </ImageWrapper>

      <ContentWrapper>
        <InfoRow>
          <InfoItem>
            <IconWrapper>
              <Calendar size={16} />
            </IconWrapper>
            <span>{formatDate(event.date)}</span>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <Clock size={16} />
            </IconWrapper>
            <span>{event.time}</span>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <MapPin size={16} />
            </IconWrapper>
            <span>{event.location}</span>
          </InfoItem>
        </InfoRow>

        <motion.div
          variants={contentVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <Description>
            <p>{event.description}</p>

            <TagsContainer>
              {event.tags.map((tag, index) => (
                <TagBadge key={index}>
                  <Tag size={12} style={{ marginRight: 4 }} />
                  {tag}
                </TagBadge>
              ))}
            </TagsContainer>

            <Attendees>
              <Users size={16} style={{ marginRight: 4, color: "#6b7280" }} />
              <span>{event.attendees} attendees</span>
            </Attendees>
          </Description>

          {event.status === "upcoming" && (
            <RegisterButton onClick={handleClick}>
              Register Now
              <ExternalLink size={16} style={{ marginLeft: 4 }} />
            </RegisterButton>
          )}
        </motion.div>

        <ToggleButton onClick={toggleExpand}>
          {isExpanded ? "Show Less" : "Show More"}
        </ToggleButton>
      </ContentWrapper>
    </Card>
  );
};

export default EventCard;
