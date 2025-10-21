import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Calendar, ClipboardCheck, Award, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../../utils/apiUtils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
        headers: getAuthHeaders()
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading dashboard...</LoadingContainer>;
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.stats?.totalUsers?.count || 0,
      icon: Users,
      color: '#4285f4',
      growth: stats?.stats?.totalUsers?.change || 0
    },
    {
      title: 'Total Events',
      value: stats?.stats?.activeEvents?.total || 0,
      icon: Calendar,
      color: '#ea4335',
      growth: 0
    },
    {
      title: 'Pending Registrations',
      value: stats?.stats?.pendingRegistrations?.count || 0,
      icon: ClipboardCheck,
      color: '#fbbc04',
      growth: 0
    },
    {
      title: 'Certificates Issued',
      value: stats?.stats?.certificatesIssued?.count || 0,
      icon: Award,
      color: '#34a853',
      growth: 0
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Dashboard Overview</Title>
        <Subtitle>Welcome to GDG Admin Portal</Subtitle>
      </Header>

      <StatsGrid>
        {statsCards.map((card, index) => (
          <StatsCard key={index} $color={card.color}>
            <CardIcon>
              <card.icon size={32} color={card.color} />
            </CardIcon>
            <CardContent>
              <CardTitle>{card.title}</CardTitle>
              <CardValue>{card.value.toLocaleString()}</CardValue>
              {card.growth !== 0 && (
                <Growth $positive={card.growth > 0}>
                  {card.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(card.growth)}%
                </Growth>
              )}
            </CardContent>
          </StatsCard>
        ))}
      </StatsGrid>

      <InfoGrid>
        <InfoCard>
          <InfoTitle>Quick Stats</InfoTitle>
          <InfoList>
            <InfoItem>
              <InfoLabel>Active Events</InfoLabel>
              <InfoValue>{stats?.stats?.activeEvents?.count || 0}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>New Users This Week</InfoLabel>
              <InfoValue>{stats?.stats?.newUsersThisWeek?.count || 0}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Certificates This Month</InfoLabel>
              <InfoValue>{stats?.stats?.certificatesIssued?.count || 0}</InfoValue>
            </InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoTitle>Quick Actions</InfoTitle>
          <ActionButton onClick={() => window.location.href = '/admin/events/create'}>
            Create New Event
          </ActionButton>
          <ActionButton onClick={() => window.location.href = '/admin/notifications'}>
            Send Notification
          </ActionButton>
          <ActionButton onClick={() => window.location.href = '/admin/registrations?status=pending'}>
            Review Registrations
          </ActionButton>
        </InfoCard>
      </InfoGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  border-left: 4px solid ${props => props.$color};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #333;
`;

const Growth = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${props => props.$positive ? '#34a853' : '#ea4335'};
  margin-top: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const InfoValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #4285f4, #ea4335);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 12px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export default AdminDashboard;
