import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  UserCheck,
  Filter,
  Users,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [searchTerm, filterStatus, selectedEvent, pagination.page]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : 'https://gdg-backend-ten.vercel.app'}/api/admin/events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { limit: 100 }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${window.location.origin.includes('localhost') ? 'http://localhost:5000' : 'https://gdg-backend-ten.vercel.app'}/api/admin/registrations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          status: filterStatus,
          eventId: selectedEvent
        }
      });
      setRegistrations(response.data.registrations);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/registrations/${registrationId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRegistrations();
    } catch (error) {
      console.error('Failed to approve registration:', error);
    }
  };

  const handleReject = async (registrationId) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/registrations/${registrationId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRegistrations();
    } catch (error) {
      console.error('Failed to reject registration:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedRegistrations.length === 0) {
      alert('Please select registrations to approve');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/registrations/bulk-approve',
        { registrationIds: selectedRegistrations },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRegistrations([]);
      fetchRegistrations();
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    }
  };

  const handleMarkAttendance = async (registrationId, attended) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/registrations/${registrationId}/attendance`,
        { attended },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRegistrations();
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/registrations/export', {
        headers: { Authorization: `Bearer ${token}` },
        params: { eventId: selectedEvent },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registrations-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export registrations:', error);
    }
  };

  const toggleSelection = (id) => {
    setSelectedRegistrations(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fbbc04',
      approved: '#34a853',
      rejected: '#ea4335'
    };
    return colors[status] || '#666';
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Registration Management</Title>
          <Subtitle>Manage event registrations and approvals</Subtitle>
        </div>
        <HeaderActions>
          {selectedRegistrations.length > 0 && (
            <BulkButton onClick={handleBulkApprove}>
              <CheckCircle size={20} />
              Approve Selected ({selectedRegistrations.length})
            </BulkButton>
          )}
          <ExportButton onClick={handleExport}>
            <Download size={20} />
            Export CSV
          </ExportButton>
        </HeaderActions>
      </Header>

      <FilterBar>
        <SearchBox>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <FilterGroup>
          <Select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
            <option value="">All Events</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </Select>

          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </FilterGroup>
      </FilterBar>

      {loading ? (
        <LoadingContainer>Loading registrations...</LoadingContainer>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>
                  <input
                    type="checkbox"
                    checked={selectedRegistrations.length === registrations.length && registrations.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRegistrations(registrations.map(r => r._id));
                      } else {
                        setSelectedRegistrations([]);
                      }
                    }}
                  />
                </Th>
                <Th>Student</Th>
                <Th>Event</Th>
                <Th>College</Th>
                <Th>Year</Th>
                <Th>Status</Th>
                <Th>Attended</Th>
                <Th>Registered</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg._id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(reg._id)}
                      onChange={() => toggleSelection(reg._id)}
                    />
                  </Td>
                  <Td>
                    <UserInfo>
                      <UserName>{reg.user?.name}</UserName>
                      <UserEmail>{reg.user?.email}</UserEmail>
                    </UserInfo>
                  </Td>
                  <Td>{reg.event?.name}</Td>
                  <Td>{reg.user?.college || 'N/A'}</Td>
                  <Td>{reg.user?.year || 'N/A'}</Td>
                  <Td>
                    <StatusBadge $color={getStatusColor(reg.status)}>
                      {reg.status}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <AttendanceToggle>
                      <input
                        type="checkbox"
                        checked={reg.attended || false}
                        onChange={(e) => handleMarkAttendance(reg._id, e.target.checked)}
                      />
                      <span>{reg.attended ? 'Yes' : 'No'}</span>
                    </AttendanceToggle>
                  </Td>
                  <Td>{new Date(reg.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <ActionButtons>
                      {reg.status === 'pending' && (
                        <>
                          <ActionButton
                            $success
                            onClick={() => handleApprove(reg._id)}
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </ActionButton>
                          <ActionButton
                            $danger
                            onClick={() => handleReject(reg._id)}
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </ActionButton>
                        </>
                      )}
                      {reg.status === 'approved' && !reg.attended && (
                        <ActionButton
                          onClick={() => handleMarkAttendance(reg._id, true)}
                          title="Mark Attended"
                        >
                          <UserCheck size={16} />
                        </ActionButton>
                      )}
                    </ActionButtons>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PaginationInfo>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} registrations
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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const BulkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #34a853;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f5f5f5;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const SearchBox = styled.div`
  flex: 1;
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
  min-width: 150px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: #f9f9f9;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #333;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #999;
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

const AttendanceToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px;
  background: ${props => props.$success ? '#d4edda' : props.$danger ? '#fee' : 'white'};
  border: 1px solid ${props => props.$success ? '#34a853' : props.$danger ? '#ea4335' : '#ddd'};
  color: ${props => props.$success ? '#34a853' : props.$danger ? '#ea4335' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$success ? '#34a853' : props.$danger ? '#ea4335' : '#f5f5f5'};
    color: ${props => props.$success || props.$danger ? 'white' : '#333'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
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

export default Registrations;
