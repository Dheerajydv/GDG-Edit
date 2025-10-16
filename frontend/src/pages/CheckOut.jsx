import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";

import EventHeader from "../components/EventHeader";
import RSVPForm from "../components/RSVPForm";
import ThemeToggle from "../components/ThemeToggle";
import Header from "../components/Header";

// Mock event data
const mockEvent = {
  id: "gdg-web-dev-2025",
  title: "GDG Web Development Workshop",
  description:
    "Join us for an exciting hands-on workshop covering modern web development with React, TypeScript, and the latest tools. Perfect for developers of all skill levels.",
  date: "2025-02-15",
  time: "10:00 AM",
  location: "Tech Hub, Downtown",
  max_attendees: 50,
  current_attendees: 23,
  image_url:
    "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg",
};

// Styled Components
const AppWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    #f9fafb,
    #eff6ff,
    #eef2ff
  );
  transition: all 0.5s ease;

  &.dark {
    background: linear-gradient(to bottom right, #111827, #1e293b, #374151);
  }
`;

const ThemeToggleWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
`;

const MainContent = styled.div`
  position: relative;
  padding: 4rem 1.5rem;
`;

const ContentGrid = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #111827;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
      color: #374151;
    }

    div {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      margin-right: 0.75rem;
      margin-top: 0.5rem;
      flex-shrink: 0;
    }

    span {
      flex: 1;
    }
  }
`;

const ScheduleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    font-weight: 500;
    color: #111827;
  }

  span:last-child {
    color: #6b7280;
  }
`;

const StickyForm = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: 2rem;
  }
`;

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem 1.5rem;

  &.dark {
    background: rgba(17, 24, 39, 0.7);
    border-color: rgba(55, 65, 81, 0.5);
  }

  p {
    text-align: center;
    color: #6b7280;
  }

  a {
    color: #4285f4;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function CheckOut() {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
  };

  return (
   
      <AppWrapper>
        {/* Theme Toggle */}
       
        {/* Event Header */}

        {/* Main Content */}
        <MainContent>
          <ContentGrid>
            {/* Event Details */}
            <div style={{ display:"flex", flexDirection:"column",gap:"2rem" }}>
              {/* What You'll Learn */}
              <Card>
  <h2>Important Instructions</h2>
  <ul>
    <li>
      <div style={{ background: "#4285f4" }}></div>
      <span>Reporting Time: <strong>9:30 AM sharp</strong>. Be punctual.</span>
    </li>
    <li>
      <div style={{ background: "#ea4335" }}></div>
      <span>Dress Code: <strong>Formal attire</strong> is mandatory for all participants.</span>
    </li>
    <li>
      <div style={{ background: "#a142f4" }}></div>
      <span>Carry your college ID card and Laptop.</span>
    </li>
    <li>

      <div style={{ background: "#34a853" }}></div>
      <span>Maintain professional behavior. Professors or faculty may inspect anytime.</span>
    </li>
    <li>
      <div style={{ background: "#fbbc05" }}></div>
      <span>Keep your phones on silent and avoid unnecessary disturbances.</span>
    </li>
    
  </ul>
</Card>

{/* Event Schedule */}
<Card>
  <h2>Event Schedule</h2>
  <div>
    <ScheduleItem>
      <span>Reporting & Registration</span>
      <span>9:30 AM - 10:00 AM</span>
    </ScheduleItem>
    <ScheduleItem>
      <span>Opening & Welcome Address</span>
      <span>10:00 AM- 10:15 AM</span>
    </ScheduleItem>
    <ScheduleItem>
      <span>Induction Activities - Session 1</span>
      <span>10:15 AM - 1:30 PM</span>
    </ScheduleItem>
    <ScheduleItem>
      <span>Lunch Break</span>
      <span>1:30  PM- 2:30 PM</span>
    </ScheduleItem>
    <ScheduleItem>
      <span>Induction Activities - Session 2</span>
      <span>2:30 PM- 4:30 PM</span>
    </ScheduleItem>
    <ScheduleItem>
      <span>Interaction, Feedback & Q&A</span>
      <span>4:30 PM- 5:00 PM</span>
    </ScheduleItem>
    <ScheduleItem>
      <span>Closing & Group Photo</span>
      <span>5:00 PM- 5:30 PM</span>
    </ScheduleItem>
  </div>
</Card>

            </div>

            {/* RSVP Form */}
            <StickyForm>
              <RSVPForm eventId={mockEvent.id} onSuccess={handleRegistrationSuccess} />
            </StickyForm>
          </ContentGrid>
        </MainContent>

        {/* Footer */}
        <Footer>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p>
              Organized by Google Developer Groups • Questions? Contact  at{" "}
              <a href="mailto:hello@gdg.dev">avanishupadhyay633@gmail.com</a>
            </p>
          </div>
        </Footer>
      </AppWrapper>
   
  );
}

export default CheckOut;
