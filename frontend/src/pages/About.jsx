import React, { useEffect, useRef } from 'react';
import { Smartphone , Globe, Bot, CircuitBoard , Shield, Cpu, Cloud, Network, Link, Server } from 'lucide-react';
import styled from 'styled-components';
import '../styles/About.css';

const Aboutid = styled.section`
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 80px 20px;
  max-width: 1100px;
  margin: 0 auto;

 .section-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem); /* Responsive size */
  font-weight: 800;
  background: linear-gradient(
    135deg,
    #4285f4 0%,   /* Google Blue */
    #ea4335 25%,  /* Google Red */
    #fbbc05 50%,  /* Google Yellow */
    #34a853 75%,  /* Google Green */
    #4285f4 100%  /* Loop back to Blue */
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center; /* Centered for balance */
  margin: 2rem 0 1.5rem 0; /* Top and bottom breathing space */
  line-height: 1.2;
  letter-spacing: 0.5px; /* Slightly open letters for readability */
}

/* Optional: subtle underline animation */
.section-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  margin: 0.5rem auto 0;
  background-color: rgba(93, 167, 223, 0.7);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.section-title:hover::after {
  width: 80px;
}

  p {
    line-height: 1.6;
    font-size: 1.05rem;
    text-align: justify;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 60px 15px;
    .section-title {
      font-size: 1.8rem;
      text-align: center;
    }
    p {
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    padding: 50px 10px;
    .section-title {
      font-size: 1.6rem;
    }
  }
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;

  .feature-card {
    background-color: ${({ theme }) => theme.colors.background.secondary};\
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    opacity: 0;
    transform: translateY(30px);

    &.visible {
      opacity: 1;
      transform: translateY(0);
    }

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
    }
  }

  .feature-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    background-color: ${({ theme }) => theme.colors.background.primary};
    box-shadow: 0 2px 10px ${({ theme }) => theme.colors.shadow};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 2.5rem;
    transition: transform 0.3s ease;

    .feature-card:hover & {
      transform: scale(1.1) rotate(5deg);
    }
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }

  p {
    color: ${({ theme }) => theme.colors.text.tertiary};
    font-size: 1rem;
    line-height: 1.5;
  }
`

const AboutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2rem;
  margin-top: 4rem;

  .stat-card {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.background.primary}, ${({ theme }) => theme.colors.background.secondary});
    color: ${({ theme }) => theme.colors.text.primary};
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 15px ${({ theme }) => theme.colors.shadow};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateY(30px);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
    }
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .stat-label {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1rem;
    font-weight: 500;
  }
`;

const About = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    cardsRef.current.forEach(card => card && observer.observe(card));

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      cardsRef.current.forEach(card => card && observer.unobserve(card));
    };
  }, []);

  const features = [
    {
      icon: <Globe size={36} />,
      title: 'Web Development',
      description: "Connect with developers from around the world and be part of Google's global developer network.",
    },
    {
      icon: <Smartphone  size={36} />,
      title: 'Android Development',
      description: 'Learn new technologies through practical workshops led by industry experts and Google Developer Experts.',
    },
    {
      icon: <div className="flex items-center gap-1">
<Bot size={48} color="#4F46E5" />
<CircuitBoard size={20} color="#4F46E5" />
</div>,
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Meet like-minded developers, form valuable connections, and collaborate on exciting projects.',
    },
    {
      icon: <div className="flex items-center gap-1">
  <Shield size={44} color="#9042f5" />
  <Cpu size={20} color="#9042f5" />
</div>,
      title: 'Cybersecurity and Cryptography',
      description: 'Get inspired, share ideas, and stay ahead of the curve with the latest Google technologies and tools.',
    },
    {
      icon: <div className="flex items-center gap-1">
  <Network size={22} color="#f59e42" />
  <Link size={40} color="#f59e42" />
</div>,
      title: 'Blockchain & Web 3.0',
      description: 'Focus on the future of decentralized technologies.',
    },
    {
      icon: <div className="flex items-center gap-1">
  <Server size={20} color="#2563EB" />
  <Cloud size={44} color="#2563EB" />
</div>,
      title: 'Open Source & Cloud Computing',
      description: 'Harness the power of open-source tools and scalable cloud solutions.',
    },
  ];

  return (
    <Aboutid className="about">
      <Container>
        <div ref={sectionRef} className="about-header animate-on-scroll">
          <h2 className="section-title">About GDG on Campus MMMUT</h2>
          <p className="about-description">
            <p>
              Founded on 26th September 2020 by our esteemed alumnus Abhishek Kumar Yadav, we
            began as Developer Student Clubs (DSC), as a part of the Google Developers Program. Over
            the period of time we have developed, expanded and evolved to become the largest developer
            based community of our campus and in the region as well. Our mission has always been to
            promote technology, foster innovation, and nurture skill development within the tech
            community. Through workshops, hackathons, and expert sessions, we cover a diverse range
            of domains, including:
            </p>
            <div className='flex flex-col items-start flex-1/6 justify-center'>
              <p>💻 Web Development</p>
              <p>📱 Android Development</p>
              <p>🤖 Artificial Intelligence & Machine Learning</p>
              <p>📊 Cybersecurity & Cryptography</p>
              <p>🔗 Blockchain & Web 3.0</p>
              <p>🌐 Open Source & Cloud Computing</p>
            </div>
            <p>In 2021, we underwent a strategic rebranding as Google Developer Student Clubs (GDSC),
              aligning more closely with Google’s global vision of empowering students through
              technology-driven development.</p>

            <p>
              A landmark moment arrived in 2024 with the launch of IMMERSE, our Annual Developer
              Fest—a three-day carnival celebrating cutting-edge technologies like Web & Android
              Development, Artificial Intelligence & Machine Learning, Cryptography & Cybersecurity,
              Blockchain Development, Open Source & Cloud Computing, and more! Alongside technical
              sessions, IMMERSE features Tech-Informals, blending learning with creativity and fun.
              The same year, we evolved into Google Developer Groups (GDG) on Campus, MMMUT
              (GDG-MMMUT), reaffirming our commitment to building a vibrant tech ecosystem. As
              GDG-MMMUT, we continue to bridge the gap between theory and practice, offering handson learning, workshops, speaker sessions, bootcamps, events & fests that include all of Web
            </p>

            <p>
              Development, Android Development, Artificial Intelligence & Machine Learning,
              Cybersecurity & Cryptography, Blockchain & Web 3.0, Open Source & Cloud Computing
              networking opportunities, and exposure to industry trends.
              Other Than this we regularly conduct & organize events which are a part of Google
              Developer Initative like Google Cloud Gen AI Study Jams, Google Cloud Arcade Skills
              Boost Programme, Google’s Week of Wonders, Google’s Solution Challenge and the largest
              worldwide fest of the Google Developer Programme i.e. DevFest
              <a href="https://gdg.community.dev/gdg-on-campus-madan-mohan-malaviya-university-oftechnology-gorakhpur-india/"> Join Our Community!</a>
            </p>

            

          </p>
          <h3>Join a thriving community of Google developers.</h3>
        </div>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              ref={el => (cardsRef.current[index] = el)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </FeaturesGrid>

        <AboutStats>
          <div className="stat-card">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Community Members</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">50+</span>
            <span className="stat-label">Events Organized</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Speakers</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">2+</span>
            <span className="stat-label">Hackathons</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Workshops</span>
          </div>
        </AboutStats>
      </Container>
    </Aboutid>
  );
};

export default About;
