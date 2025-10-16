import { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
const WinnersSectionContainer = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  position: relative;
  overflow: hidden;
`;
const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
const SectionHeader = styled.div`
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
    background-color: ${({ theme }) => theme.colors.background};
  }
`;
const SectionDescription = styled.p`
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
const WinnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;
const WinnerCard = styled(motion.div)`
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
const WinnerImage = styled.div`
  height: 200px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  ${WinnerCard}:hover & img {
    transform: scale(1.05);
  }
`;
const WinnerContent = styled.div`
  padding: 1.5rem;
`;
const EventBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme, $eventType }) => {
    switch($eventType) {
      case 'hackathon': return theme.googleColors.blue.light;
      case 'codelab': return theme.googleColors.green.light;
      case 'challenge': return theme.googleColors.yellow.light;
      case 'competition': return theme.googleColors.red.light;
      default: return theme.colors.primary;
    }
  }};
  color: ${({ theme, $eventType }) => {
    switch($eventType) {
      case 'hackathon': return theme.googleColors.blue.darker;
      case 'codelab': return theme.googleColors.green.darker;
      case 'challenge': return theme.googleColors.yellow.darker;
      case 'competition': return theme.googleColors.red.darker;
      default: return theme.colors.text.inverse;
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
`;

const WinnerName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProjectName = styled.h4`
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const WinnerDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

// Dummy winner data
const winnersData = [
  {
    id: 1,
    name: "Team Innovators",
    project: "EcoTrack",
    description: "A sustainable solution for tracking carbon footprint using machine learning and Google Cloud.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    eventType: "hackathon"
  },
  {
    id: 2,
    name: "Digital Wizards",
    project: "MediAssist",
    description: "An AI-powered healthcare assistant built with TensorFlow that helps in early disease detection.",
    image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    eventType: "challenge"
  },
  {
    id: 3,
    name: "Code Crafters",
    project: "LearnSync",
    description: "A collaborative learning platform using Firebase and Google Classroom API integration.",
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    eventType: "codelab"
  },
  {
    id: 4,
    name: "Tech Titans",
    project: "CityPulse",
    description: "Smart city infrastructure monitoring system using IoT sensors and Google Maps Platform.",
    image: "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    eventType: "competition"
  },
  {
    id: 5,
    name: "Data Dynamos",
    project: "AgriSense",
    description: "An agriculture monitoring solution that helps farmers make data-driven decisions using Google Earth Engine.",
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    eventType: "hackathon"
  },
  {
    id: 6,
    name: "Cloud Crusaders",
    project: "SafeRoute",
    description: "A real-time public safety app that suggests safe routes using Google Maps and crowdsourced data.",
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    eventType: "challenge"
  }
];

const WinnersSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <WinnersSectionContainer id="winners" className="animate-section">
      <SectionContent ref={sectionRef}>
        <SectionHeader>
          <SectionTitle>Recent Winners</SectionTitle>
          <SectionDescription>
            Celebrating the innovative projects and exceptional talent from our community events and competitions.
          </SectionDescription>
        </SectionHeader>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <WinnersGrid>
            {winnersData.map((winner) => (
              <WinnerCard key={winner.id} variants={itemVariants}>
                <WinnerImage>
                  <img src={winner.image} alt={winner.project} />
                </WinnerImage>
                
                <WinnerContent>
                  <EventBadge $eventType={winner.eventType}>
                    {winner.eventType.charAt(0).toUpperCase() + winner.eventType.slice(1)}
                  </EventBadge>
                  
                  <WinnerName>{winner.name}</WinnerName>
                  <ProjectName>{winner.project}</ProjectName>
                  <WinnerDescription>{winner.description}</WinnerDescription>
                </WinnerContent>
              </WinnerCard>
            ))}
          </WinnersGrid>
        </motion.div>
      </SectionContent>
    </WinnersSectionContainer>
  );
};
export default WinnersSection;