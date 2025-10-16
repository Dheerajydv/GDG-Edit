import { useState } from 'react';
import styled from 'styled-components';
import { X, Upload, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import axios from 'axios';

const CreateEventModal = ({ show, onClose, onSuccess, editEvent = null }) => {
  const [formData, setFormData] = useState(editEvent || {
    name: '',
    description: '',
    type: 'Hackathon',
    location: '',
    date: '',
    time: '',
    capacity: 100,
    registrationDeadline: '',
    image: '',
    tags: [],
    published: false,
    registrationOpen: true,
    eventCategory: 'general'
  });

  const [currentTag, setCurrentTag] = useState('');

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editEvent 
        ? `http://localhost:5000/api/admin/events/${editEvent._id}`
        : 'http://localhost:5000/api/admin/events';
      
      const method = editEvent ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>{editEvent ? 'Edit Event' : 'Create New Event'}</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Basic Information</SectionTitle>
            
            <FormGroup>
              <Label>Event Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., HackBlitz 2024"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows={4}
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Event Type *</Label>
                <Select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="Workshop">Workshop</option>
                  <option value="Study Jam">Study Jam</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Conference">Conference</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Tech Fest">Tech Fest</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Event Category</Label>
                <Select name="eventCategory" value={formData.eventCategory} onChange={handleChange}>
                  <option value="general">General</option>
                  <option value="study-jam">Study Jam</option>
                  <option value="immerse">Immerse</option>
                  <option value="hackblitz">HackBlitz</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Event Image URL</Label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Date, Time & Location</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label>Event Date *</Label>
                <Input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Event Time *</Label>
                <Input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 09:00 AM - 05:00 PM"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Location *</Label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., MMMUT Gorakhpur or Zoom Meeting"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <Label>Registration Deadline</Label>
                <Input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </Section>

          <Section>
            <SectionTitle>Tags</SectionTitle>
            
            <TagInput>
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags (e.g., AI, ML, Web Dev)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <AddButton type="button" onClick={addTag}>Add Tag</AddButton>
            </TagInput>

            <TagsList>
              {formData.tags.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <RemoveButton onClick={() => removeTag(index)}>×</RemoveButton>
                </Tag>
              ))}
            </TagsList>
          </Section>

          <Section>
            <SectionTitle>Settings</SectionTitle>
            
            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                />
                Publish event immediately
              </CheckboxLabel>
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="registrationOpen"
                  checked={formData.registrationOpen}
                  onChange={handleChange}
                />
                Registration open
              </CheckboxLabel>
            </FormGroup>
          </Section>

          <Footer>
            <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
            <SubmitButton type="submit">{editEvent ? 'Update Event' : 'Create Event'}</SubmitButton>
          </Footer>
        </Form>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
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
  overflow-y: auto;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f5f5f5;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

const TagInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const AddButton = styled.button`
  padding: 12px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #e8f0fe;
  color: #4285f4;
  border-radius: 16px;
  font-size: 13px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ea4335;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
  margin-left: auto;

  &:hover {
    opacity: 0.7;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
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

export default CreateEventModal;
