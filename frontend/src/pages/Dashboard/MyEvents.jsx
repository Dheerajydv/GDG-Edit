import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Container = styled.div`
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$active ? '#667eea' : 'white'};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    color: #667eea;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.85rem;
    font-size: 0.85rem;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const EventImage = styled.div`
  width: 100%;
  height: 180px;
  background: ${props => props.$image 
    ? `url(${props.$image})` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const EventStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: ${props => {
    switch(props.$status) {
      case 'registered': return '#10b981';
      case 'completed': return '#667eea';
      case 'cancelled': return '#f43f5e';
      default: return '#6b7280';
    }
  }};
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;

  svg {
    color: #667eea;
  }
`;

const EventDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventActions = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'transparent'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#667eea'};
  border: ${props => props.$variant === 'primary' ? 'none' : '2px solid #667eea'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const LoadingSpinner = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  
  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000';

      const response = await axios.get(
        `${API_BASE_URL}/api/registrations/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredEvents = () => {
    const now = new Date();
    
    switch(activeTab) {
      case 'upcoming':
        return events.filter(event => {
          const eventDate = new Date(event.eventId?.startDate);
          return eventDate > now && event.status !== 'cancelled';
        });
      case 'past':
        return events.filter(event => {
          const eventDate = new Date(event.eventId?.endDate);
          return eventDate < now || event.status === 'completed';
        });
      case 'cancelled':
        return events.filter(event => event.status === 'cancelled');
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  const handleViewDetails = (eventId) => {
    // Navigate to event details
    window.location.href = `/events/${eventId}`;
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000';

      await axios.delete(
        `${API_BASE_URL}/api/registrations/${registrationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh events
      fetchMyEvents();
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration. Please try again.');
    }
  };

  return (
    <Container>
      <Header>
        <Title>My Events 📅</Title>
        <Subtitle>Track and manage your event registrations</Subtitle>
      </Header>

      <Tabs>
        <Tab 
          $active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Events ({events.length})
        </Tab>
        <Tab 
          $active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </Tab>
        <Tab 
          $active={activeTab === 'past'} 
          onClick={() => setActiveTab('past')}
        >
          Past
        </Tab>
        <Tab 
          $active={activeTab === 'cancelled'} 
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </Tab>
      </Tabs>

      <EventsGrid>
        {loading ? (
          <LoadingSpinner />
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((registration) => {
            const event = registration.eventId;
            if (!event) return null;

            return (
              <EventCard key={registration._id}>
                <EventImage $image={event.imageUrl}>
                  <EventStatus $status={registration.status}>
                    {registration.status}
                  </EventStatus>
                </EventImage>
                
                <EventContent>
                  <EventTitle>{event.title}</EventTitle>
                  
                  <EventDetails>
                    <EventDetail>
                      <FiCalendar />
                      <span>{formatDate(event.startDate)}</span>
                    </EventDetail>
                    <EventDetail>
                      <FiMapPin />
                      <span>{event.location || 'Online'}</span>
                    </EventDetail>
                    <EventDetail>
                      <FiUsers />
                      <span>{event.maxParticipants} participants</span>
                    </EventDetail>
                  </EventDetails>

                  <EventDescription>{event.description}</EventDescription>

                  <EventActions>
                    <Button 
                      $variant="primary"
                      onClick={() => handleViewDetails(event._id)}
                    >
                      View Details
                    </Button>
                    {registration.status === 'registered' && (
                      <Button 
                        onClick={() => handleCancelRegistration(registration._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </EventActions>
                </EventContent>
              </EventCard>
            );
          })
        ) : (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>
              {activeTab === 'all' 
                ? "You haven't registered for any events yet"
                : `No ${activeTab} events found`}
            </EmptyText>
            <Button 
              $variant="primary"
              onClick={() => window.location.href = '/events'}
            >
              Browse Events
            </Button>
          </EmptyState>
        )}
      </EventsGrid>
    </Container>
  );
};

export default MyEvents;
