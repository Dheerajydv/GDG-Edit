import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import CreateEventModal from './CreateEventModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterPublished, setFilterPublished] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, filterType, filterMode, filterPublished, pagination.page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/events', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          type: filterType,
          mode: filterMode,
          published: filterPublished
        }
      });
      setEvents(response.data.events);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (eventId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/events/${eventId}/publish`,
        { publish: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  };

  const handleDuplicate = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/events/${eventId}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (error) {
      console.error('Failed to duplicate event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      workshop: '#4285f4',
      seminar: '#ea4335',
      hackathon: '#fbbc04',
      competition: '#34a853',
      meetup: '#9c27b0'
    };
    return colors[type] || '#666';
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Event Management</Title>
          <Subtitle>Manage all events, workshops, and hackathons</Subtitle>
        </div>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Event
        </CreateButton>
      </Header>

      <FilterBar>
        <SearchBox>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <FilterGroup>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Workshop">Workshop</option>
            <option value="Study Jam">Study Jam</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Meetup">Meetup</option>
            <option value="Conference">Conference</option>
            <option value="Webinar">Webinar</option>
            <option value="Tech Fest">Tech Fest</option>
          </Select>

          <Select value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="study-jam">Study Jam</option>
            <option value="immerse">Immerse</option>
            <option value="hackblitz">HackBlitz</option>
          </Select>

          <Select value={filterPublished} onChange={(e) => setFilterPublished(e.target.value)}>
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </Select>
        </FilterGroup>
      </FilterBar>

      {loading ? (
        <LoadingContainer>Loading events...</LoadingContainer>
      ) : (
        <>
          <EventsGrid>
            {events.map((event) => (
              <EventCard key={event._id}>
                <EventImage>
                  {event.image ? (
                    <img src={event.image} alt={event.name} />
                  ) : (
                    <PlaceholderImage>
                      <Calendar size={48} />
                    </PlaceholderImage>
                  )}
                  <PublishBadge $published={event.published}>
                    {event.published ? 'Published' : 'Draft'}
                  </PublishBadge>
                </EventImage>

                <EventContent>
                  <EventHeader>
                    <EventType $color={getEventTypeColor(event.type)}>
                      {event.type}
                    </EventType>
                    {event.eventCategory && event.eventCategory !== 'general' && (
                      <EventMode>{event.eventCategory}</EventMode>
                    )}
                  </EventHeader>

                  <EventTitle>{event.name}</EventTitle>
                  
                  <EventMeta>
                    <MetaItem>
                      <Calendar size={16} />
                      {new Date(event.date).toLocaleDateString()} {event.time && `• ${event.time}`}
                    </MetaItem>
                    {event.location && (
                      <MetaItem>
                        <MapPin size={16} />
                        {event.location}
                      </MetaItem>
                    )}
                  </EventMeta>

                  <EventStats>
                    <StatItem>
                      <Users size={16} />
                      <span>{event.stats?.totalRegistrations || 0} registered</span>
                    </StatItem>
                    {event.capacity && (
                      <StatItem>
                        <span>{event.stats?.capacityUsed || 0}% capacity ({event.registeredCount || 0}/{event.capacity})</span>
                      </StatItem>
                    )}
                  </EventStats>

                  <EventActions>
                    <ActionButton onClick={() => window.location.href = `/admin/events/${event._id}`}>
                      <Eye size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => window.location.href = `/admin/events/${event._id}/edit`}>
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDuplicate(event._id)}>
                      <Copy size={16} />
                    </ActionButton>
                    <ActionButton 
                      $primary={!event.published}
                      onClick={() => handleTogglePublish(event._id, event.published)}
                    >
                      {event.published ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </ActionButton>
                    <ActionButton $danger onClick={() => handleDelete(event._id)}>
                      <Trash2 size={16} />
                    </ActionButton>
                  </EventActions>
                </EventContent>
              </EventCard>
            ))}
          </EventsGrid>

          <Pagination>
            <PaginationInfo>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} events
            </PaginationInfo>
            <PaginationButtons>
              <PageButton
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </PageButton>
              <PageButton
                disabled={pagination.page * pagination.limit >= pagination.total}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </PageButton>
            </PaginationButtons>
          </Pagination>
        </>
      )}

      <CreateEventModal 
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchEvents}
      />
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4285f4, #ea4335);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  padding: 10px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const EventImage = styled.div`
  position: relative;
  height: 180px;
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const PublishBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$published ? '#34a853' : '#666'};
  color: white;
`;

const EventContent = styled.div`
  padding: 16px;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const EventType = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$color};
  color: white;
  text-transform: capitalize;
`;

const EventMode = styled.span`
  font-size: 12px;
  color: #666;
  text-transform: capitalize;
`;

const EventTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
`;

const EventStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
`;

const EventActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px;
  background: ${props => props.$danger ? '#fee' : props.$primary ? '#e3f2fd' : 'white'};
  border: 1px solid ${props => props.$danger ? '#ea4335' : props.$primary ? '#4285f4' : '#ddd'};
  color: ${props => props.$danger ? '#ea4335' : props.$primary ? '#4285f4' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$danger ? '#ea4335' : props.$primary ? '#4285f4' : '#f5f5f5'};
    color: ${props => props.$danger || props.$primary ? 'white' : '#333'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Events;

