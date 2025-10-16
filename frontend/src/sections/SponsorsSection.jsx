import { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const SponsorsSectionContainer = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
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
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SponsorsGrid = styled.div`
  display: grid;
  gap: 3rem;
`;

const SponsorTier = styled.div`
  margin-bottom: 3rem;
`;

const TierTitle = styled.h3`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme, $type }) => {
    switch($type) {
      case 'platinum': return theme.googleColors.blue.primary;
      case 'gold': return theme.googleColors.yellow.dark;
      case 'silver': return theme.googleColors.grey[600];
      default: return theme.colors.text.primary;
    }
  }};
`;

const SponsorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const SponsorCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px ${({ theme }) => theme.colors.shadow};
  }
`;

const SponsorLogo = styled.div`
  height: 200px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  ${SponsorCard}:hover & img {
    transform: scale(1.05);
  }
`;

const SponsorContent = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const SponsorName = styled.h4`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SponsorDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const SponsorLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Dummy sponsors data
const sponsorsData = {
  platinum: [
    {
      id: 1,
      name: "Google Cloud",
      description: "Cloud computing services and APIs",
      logo: "https://res.cloudinary.com/dfstpdwih/image/upload/v1747640809/Codehelp/tmp-4-1747640809293.png",
      website: "https://cloud.google.com"
    },
    {
      id: 2,
      name: "Firebase",
      description: "App development platform",
      logo: "https://res.cloudinary.com/dfstpdwih/image/upload/v1747640084/Codehelp/tmp-2-1747640083929.png",
      website: "https://firebase.google.com"
    }
  ],
  gold: [
    {
      id: 3,
      name: "Android",
      description: "Mobile operating system",
      logo: "https://developer.android.com/static/images/brand/Android_Robot.png",
      website: "https://android.com"
    },
    {
      id: 4,
      name: "TensorFlow",
      description: "Machine learning framework",
      logo: "",
      website: "https://tensorflow.org"
    },
    {
      id: 5,
      name: "Chrome",
      description: "Web browser and platform",
      logo: "https://www.google.com/chrome/static/images/chrome-logo.svg",
      website: "https://www.google.com/chrome"
    }
  ],
  silver: [
    {
      id: 6,
      name: "Flutter",
      description: "UI toolkit for mobile apps",
      logo: "https://storage.googleapis.com/cms-storage-bucket/6a07d8a62f4308d2b854.svg",
      website: "https://flutter.dev"
    },
    {
      id: 7,
      name: "Angular",
      description: "Web application framework",
      logo: "https://angular.io/assets/images/logos/angular/angular.svg",
      website: "https://angular.io"
    },
    {
      id: 8,
      name: "Google Maps Platform",
      description: "Location-based services",
      logo: "https://developers.google.com/static/maps/images/maps-icon.svg",
      website: "https://developers.google.com/maps"
    }
  ]
};

const SponsorsSection = () => {
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
    <SponsorsSectionContainer id="sponsors" className="animate-section">
      <SectionContent ref={sectionRef}>
        <SectionHeader>
          <SectionTitle>Our Previous Sponsors</SectionTitle>
          <SectionDescription>
            We're proud to partner with leading technology companies who share our vision of fostering innovation and learning in the developer community.
          </SectionDescription>
        </SectionHeader>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SponsorsGrid>
            {/* Platinum Sponsors */}
            <SponsorTier>
              <TierTitle $type="platinum">Platinum Sponsors</TierTitle>
              <SponsorsList>
                {sponsorsData.platinum.map((sponsor) => (
                  <SponsorCard key={sponsor.id} variants={itemVariants}>
                    <SponsorLogo>
                      <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
                    </SponsorLogo>
                    <SponsorContent>
                      <SponsorName>{sponsor.name}</SponsorName>
                      <SponsorDescription>{sponsor.description}</SponsorDescription>
                      <SponsorLink href={sponsor.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </SponsorLink>
                    </SponsorContent>
                  </SponsorCard>
                ))}
              </SponsorsList>
            </SponsorTier>
            
            {/* Gold Sponsors */}
            <SponsorTier>
              <TierTitle $type="gold">Gold Sponsors</TierTitle>
              <SponsorsList>
                {sponsorsData.gold.map((sponsor) => (
                  <SponsorCard key={sponsor.id} variants={itemVariants}>
                    <SponsorLogo>
                      <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
                    </SponsorLogo>
                    <SponsorContent>
                      <SponsorName>{sponsor.name}</SponsorName>
                      <SponsorDescription>{sponsor.description}</SponsorDescription>
                      <SponsorLink href={sponsor.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </SponsorLink>
                    </SponsorContent>
                  </SponsorCard>
                ))}
              </SponsorsList>
            </SponsorTier>
            
            {/* Silver Sponsors */}
            <SponsorTier>
              <TierTitle $type="silver">Silver Sponsors</TierTitle>
              <SponsorsList>
                {sponsorsData.silver.map((sponsor) => (
                  <SponsorCard key={sponsor.id} variants={itemVariants}>
                    <SponsorLogo>
                      <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
                    </SponsorLogo>
                    <SponsorContent>
                      <SponsorName>{sponsor.name}</SponsorName>
                      <SponsorDescription>{sponsor.description}</SponsorDescription>
                      <SponsorLink href={sponsor.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </SponsorLink>
                    </SponsorContent>
                  </SponsorCard>
                ))}
              </SponsorsList>
            </SponsorTier>
          </SponsorsGrid>
        </motion.div>
      </SectionContent>
    </SponsorsSectionContainer>
  );
};

export default SponsorsSection;