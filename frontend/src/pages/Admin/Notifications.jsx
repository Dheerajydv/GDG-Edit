import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Bell, 
  Send, 
  Calendar, 
  Users, 
  Eye,
  Trash2,
  Copy,
  AlertCircle,
  Mail,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, scheduled: 0, drafts: 0, averageOpenRate: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    type: 'alert',
    title: '',
    message: '',
    targetType: 'all',
    targetRole: '',
    targetEvent: '',
    scheduledFor: ''
  });

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    fetchEvents();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/notifications/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/events', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/notifications',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreateModal(false);
      resetForm();
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Failed to create notification:', error);
      alert('Failed to create notification');
    }
  };

  const handleSend = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/notifications/${id}/send`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchStats();
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification');
    }
  };

  const handleSchedule = async (id) => {
    const dateString = prompt('Enter date/time to schedule (YYYY-MM-DD HH:MM):');
    if (!dateString) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/notifications/${id}/schedule`,
        { scheduledFor: new Date(dateString) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchStats();
      alert('Notification scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      alert('Invalid date format or failed to schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDuplicate = async (notification) => {
    setFormData({
      type: notification.type,
      title: `${notification.title} (Copy)`,
      message: notification.message,
      targetType: notification.targetType,
      targetRole: notification.targetRole || '',
      targetEvent: notification.targetEvent || '',
      scheduledFor: ''
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'alert',
      title: '',
      message: '',
      targetType: 'all',
      targetRole: '',
      targetEvent: '',
      scheduledFor: ''
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      alert: <AlertCircle size={16} />,
      email: <Mail size={16} />,
      push: <Smartphone size={16} />,
      sms: <MessageSquare size={16} />
    };
    return icons[type] || <Bell size={16} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: '#999',
      scheduled: '#fbbc04',
      sending: '#4285f4',
      sent: '#34a853',
      failed: '#ea4335'
    };
    return colors[status] || '#666';
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Notification Center</Title>
          <Subtitle>Manage and send notifications to users</Subtitle>
        </div>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <Bell size={20} />
          Create Notification
        </CreateButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon $color="#4285f4">
            <Send size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalSent}</StatValue>
            <StatLabel>Total Sent</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon $color="#fbbc04">
            <Calendar size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.scheduled}</StatValue>
            <StatLabel>Scheduled</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon $color="#999">
            <Bell size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.drafts}</StatValue>
            <StatLabel>Drafts</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon $color="#34a853">
            <Eye size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.averageOpenRate}%</StatValue>
            <StatLabel>Avg Open Rate</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {loading ? (
        <LoadingContainer>Loading notifications...</LoadingContainer>
      ) : (
        <NotificationsList>
          {notifications.map((notif) => (
            <NotificationCard key={notif._id}>
              <NotificationHeader>
                <NotificationTitle>
                  {getTypeIcon(notif.type)}
                  {notif.title}
                </NotificationTitle>
                <StatusBadge $color={getStatusColor(notif.status)}>
                  {notif.status}
                </StatusBadge>
              </NotificationHeader>

              <NotificationMessage>{notif.message}</NotificationMessage>

              <NotificationMeta>
                <MetaItem>
                  <Users size={14} />
                  Target: {notif.targetType === 'all' ? 'All Users' : notif.targetType}
                </MetaItem>
                {notif.scheduledFor && (
                  <MetaItem>
                    <Calendar size={14} />
                    Scheduled: {new Date(notif.scheduledFor).toLocaleString()}
                  </MetaItem>
                )}
                <MetaItem>
                  Created: {new Date(notif.createdAt).toLocaleDateString()}
                </MetaItem>
              </NotificationMeta>

              {notif.stats && (
                <NotificationStats>
                  <StatItem>Sent: {notif.stats.sent}</StatItem>
                  <StatItem>Opened: {notif.stats.opened}</StatItem>
                  <StatItem>Clicked: {notif.stats.clicked}</StatItem>
                  <StatItem>Failed: {notif.stats.failed}</StatItem>
                </NotificationStats>
              )}

              <NotificationActions>
                {notif.status === 'draft' && (
                  <>
                    <ActionButton onClick={() => handleSend(notif._id)}>
                      <Send size={16} />
                      Send Now
                    </ActionButton>
                    <ActionButton onClick={() => handleSchedule(notif._id)}>
                      <Calendar size={16} />
                      Schedule
                    </ActionButton>
                  </>
                )}
                <ActionButton onClick={() => handleDuplicate(notif)}>
                  <Copy size={16} />
                  Duplicate
                </ActionButton>
                <ActionButton $danger onClick={() => handleDelete(notif._id)}>
                  <Trash2 size={16} />
                  Delete
                </ActionButton>
              </NotificationActions>
            </NotificationCard>
          ))}
        </NotificationsList>
      )}

      {showCreateModal && (
        <Modal>
          <ModalOverlay onClick={() => setShowCreateModal(false)} />
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create Notification</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>Notification Type</Label>
                <TypeSelector>
                  {['alert', 'email', 'push', 'sms'].map(type => (
                    <TypeButton
                      key={type}
                      $active={formData.type === type}
                      onClick={() => setFormData({ ...formData, type })}
                    >
                      {getTypeIcon(type)}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </TypeButton>
                  ))}
                </TypeSelector>
              </FormGroup>

              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  placeholder="Enter notification title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Message</Label>
                <TextArea
                  placeholder="Enter notification message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </FormGroup>

              <FormGroup>
                <Label>Target Audience</Label>
                <Select
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                >
                  <option value="all">All Users</option>
                  <option value="role">By Role</option>
                  <option value="event">By Event</option>
                </Select>
              </FormGroup>

              {formData.targetType === 'role' && (
                <FormGroup>
                  <Label>Select Role</Label>
                  <Select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  >
                    <option value="">Select role...</option>
                    <option value="student">Student</option>
                    <option value="event_manager">Event Manager</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormGroup>
              )}

              {formData.targetType === 'event' && (
                <FormGroup>
                  <Label>Select Event</Label>
                  <Select
                    value={formData.targetEvent}
                    onChange={(e) => setFormData({ ...formData, targetEvent: e.target.value })}
                  >
                    <option value="">Select event...</option>
                    {events.map(event => (
                      <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Schedule (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                />
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={() => setShowCreateModal(false)}>Cancel</CancelButton>
              <SubmitButton onClick={handleCreate}>Create Notification</SubmitButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
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
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}22;
  color: ${props => props.$color};
  border-radius: 12px;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NotificationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const NotificationTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$color};
  color: white;
  text-transform: capitalize;
`;

const NotificationMessage = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const NotificationMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
`;

const NotificationStats = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const StatItem = styled.div`
  font-size: 12px;
  color: #666;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.$danger ? '#fee' : 'white'};
  border: 1px solid ${props => props.$danger ? '#ea4335' : '#ddd'};
  color: ${props => props.$danger ? '#ea4335' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: ${props => props.$danger ? '#ea4335' : '#f5f5f5'};
    color: ${props => props.$danger ? 'white' : '#333'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  color: #666;

  &:hover {
    background: #eee;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4285f4;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4285f4;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4285f4;
  }
`;

const TypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const TypeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: ${props => props.$active ? '#4285f4' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 1px solid ${props => props.$active ? '#4285f4' : '#ddd'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    border-color: #4285f4;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;

export default Notifications;
