import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Download, UserPlus, MoreVertical, Ban, UserCheck, Trash2, Shield } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../../utils/apiUtils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [roleChangeModal, setRoleChangeModal] = useState({ open: false, user: null, newRole: '' });
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterRole, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeaders(),
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          role: filterRole
        }
      });
      setUsers(response.data.users);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId, suspend) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/suspend`,
        { suspend, reason: 'Suspended by admin' },
        { headers: getAuthHeaders() }
      );
      fetchUsers();
    } catch (error) {
      console.error('Failed to suspend user:', error);
      alert(error.response?.data?.message || 'Failed to suspend user');
    }
  };

  const handleOpenRoleChange = (user) => {
    setRoleChangeModal({ open: true, user, newRole: user.role });
  };

  const handleCloseRoleModal = () => {
    setRoleChangeModal({ open: false, user: null, newRole: '' });
    setChangingRole(false);
  };

  const handleRoleChange = async () => {
    if (!roleChangeModal.user || !roleChangeModal.newRole) return;
    
    if (roleChangeModal.newRole === roleChangeModal.user.role) {
      alert('Please select a different role');
      return;
    }

    try {
      setChangingRole(true);
      await axios.patch(
        `${API_BASE_URL}/api/admin/users/${roleChangeModal.user._id}/role`,
        { role: roleChangeModal.newRole },
        { headers: getAuthHeaders() }
      );
      
      alert('User role updated successfully!');
      handleCloseRoleModal();
      fetchUsers();
    } catch (error) {
      console.error('Failed to change user role:', error);
      alert(error.response?.data?.message || 'Failed to change user role. You may need super admin privileges.');
    } finally {
      setChangingRole(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users/export`, {
        headers: getAuthHeaders(),
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <HeaderActions>
          <ExportButton onClick={handleExportUsers}>
            <Download size={20} />
            Export CSV
          </ExportButton>
          <AddButton>
            <UserPlus size={20} />
            Add User
          </AddButton>
        </HeaderActions>
      </Header>

      <FilterBar>
        <SearchBox>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="event_manager">Event Manager</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </Select>
      </FilterBar>

      {loading ? (
        <LoadingContainer>Loading users...</LoadingContainer>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>College</Th>
                <Th>Year</Th>
                <Th>Role</Th>
                <Th>Events</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <Td>
                    <UserName>{user.name}</UserName>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>{user.college || 'N/A'}</Td>
                  <Td>{user.year || 'N/A'}</Td>
                  <Td>
                    <RoleBadge $role={user.role}>
                      {user.role?.replace('_', ' ')}
                    </RoleBadge>
                  </Td>
                  <Td>{user.stats?.eventsRegistered || 0}</Td>
                  <Td>
                    <StatusBadge $suspended={user.suspended}>
                      {user.suspended ? 'Suspended' : 'Active'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <ActionButtons>
                      <IconButton
                        title="Change Role"
                        onClick={() => handleOpenRoleChange(user)}
                      >
                        <Shield size={16} />
                      </IconButton>
                      {user.suspended ? (
                        <IconButton
                          title="Unsuspend User"
                          onClick={() => handleSuspendUser(user._id, false)}
                        >
                          <UserCheck size={16} />
                        </IconButton>
                      ) : (
                        <IconButton
                          title="Suspend User"
                          onClick={() => handleSuspendUser(user._id, true)}
                        >
                          <Ban size={16} />
                        </IconButton>
                      )}
                      <IconButton title="More Actions">
                        <MoreVertical size={16} />
                      </IconButton>
                    </ActionButtons>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PaginationInfo>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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

      {/* Role Change Modal */}
      {roleChangeModal.open && (
        <ModalOverlay onClick={handleCloseRoleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Change User Role</ModalTitle>
              <CloseButton onClick={handleCloseRoleModal}>&times;</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <UserInfo>
                <InfoLabel>User:</InfoLabel>
                <InfoValue>{roleChangeModal.user?.name}</InfoValue>
                <InfoEmail>{roleChangeModal.user?.email}</InfoEmail>
              </UserInfo>

              <UserInfo>
                <InfoLabel>Current Role:</InfoLabel>
                <RoleBadge $role={roleChangeModal.user?.role}>
                  {roleChangeModal.user?.role?.replace('_', ' ')}
                </RoleBadge>
              </UserInfo>

              <FormGroup>
                <Label>New Role:</Label>
                <RoleSelect
                  value={roleChangeModal.newRole}
                  onChange={(e) => setRoleChangeModal(prev => ({ ...prev, newRole: e.target.value }))}
                  disabled={changingRole}
                >
                  <option value="student">Student</option>
                  <option value="event_manager">Event Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </RoleSelect>
              </FormGroup>

              <RoleDescription>
                {roleChangeModal.newRole === 'student' && 'Students can register for events and view their profile.'}
                {roleChangeModal.newRole === 'event_manager' && 'Event Managers can create and manage events, approve registrations.'}
                {roleChangeModal.newRole === 'admin' && 'Admins have full access to user management and event operations.'}
                {roleChangeModal.newRole === 'super_admin' && 'Super Admins have complete system access including role management.'}
              </RoleDescription>

              <WarningBox>
                <strong>⚠️ Warning:</strong> Changing user roles affects their system permissions. This action requires super admin privileges.
              </WarningBox>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={handleCloseRoleModal} disabled={changingRole}>
                Cancel
              </CancelButton>
              <ConfirmButton 
                onClick={handleRoleChange} 
                disabled={changingRole || roleChangeModal.newRole === roleChangeModal.user?.role}
              >
                {changingRole ? 'Changing...' : 'Change Role'}
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4285f4, #ea4335);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
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

const UserName = styled.div`
  font-weight: 500;
  color: #333;
`;

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  background: ${props => {
    switch (props.$role) {
      case 'super_admin': return '#ea4335';
      case 'admin': return '#4285f4';
      case 'event_manager': return '#fbbc04';
      default: return '#34a853';
    }
  }};
  color: white;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$suspended ? '#ea4335' : '#34a853'};
  color: white;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 6px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  color: #666;

  &:hover {
    background: #f5f5f5;
    color: #333;
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

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const InfoEmail = styled.div`
  font-size: 14px;
  color: #666;
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

const RoleSelect = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4285f4;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RoleDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 16px 0;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  line-height: 1.5;
`;

const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  font-size: 13px;
  color: #856404;
  line-height: 1.5;

  strong {
    display: block;
    margin-bottom: 4px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 0 0 16px 16px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #4285f4, #ea4335);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Users;
