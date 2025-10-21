import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/RegisterModal.css';
import styled from 'styled-components';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const ModalOverlay=styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  animation: fadeIn var(--transition-short);
`
const Modal=styled.div`
background-color: ${({theme})=>theme.colors.background.secondary};
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;

  overflow-y: auto;
  box-shadow: 0 10px 30px var(--shadow-color-strong);
  position: relative;
  animation: slideIn var(--transition-medium);`

const ModalClose=styled.div`
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: none;
    border: none;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;
    color: ${({theme})=>theme.googleColors.blue.primary};
    transition: color var(--transition-short), transform var(--transition-short);
    z-index: 10;

`
const ModalHeader=styled.div`
 padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  h2{
     font-size: var(--font-size-2xl);
  margin: 0 0 var(--spacing-md);
  color: ${({theme})=>theme.colors.text.primary};
  }
    
`
const FormGroup=styled.div`
 margin-bottom: var(--spacing-lg);
 label{
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: ${({theme})=>theme.colors.text.primary};
 }
 input,select,textarea{
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
  background-color: ${({theme})=>theme.colors.background.secondary};
  color: ${({theme})=>theme.colors.text.primary};
  font-size: var(--font-size-md);
  transition: border-color var(--transition-short), box-shadow var(--transition-short);
 }
 input:focus,select:focus,textarea:focus{
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
 }
 .error{
    border-color: var(--accent-color);
 }
`
const EventSummary=styled.div`
    margin-top: var(--spacing-xl);
    padding: var(--spacing-md);
    background-color: ${({theme})=>theme.colors.background.primary};
    border-radius: var(--radius-md);
  h3{
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-lg);
    color: ${({theme})=>theme.colors.text.primary};
  }
  p{
     margin-bottom: var(--spacing-sm);
     color: ${({theme})=>theme.colors.text.secondary};
  }
  `
  const SuccessContainer=styled.div`
    display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  text-align: center;
    h3{
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-md);
        color:${({theme})=>theme.colors.text.secondary};
    }
    p{
        color: ${({theme})=>theme.colors.text.tertiary};
       margin-bottom: var(--spacing-md);
       max-width: 400px;
    }
  `
const RegisterModal = ( {event, onClose} ) => {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    branch: '',
    reason: '',
    eventId: event?.id || '', // Assuming event has an _id field
  });
  console.log("ye h event",event)
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please fill out this field.';
      if (!formData.email.trim()) {
        newErrors.email = 'Please fill out this field.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please fill out this field.';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number.';
      }
    } else if (stepNumber === 2) {
      if (!formData.college.trim()) newErrors.college = 'Please fill out this field.';
      if (!formData.year) newErrors.year = 'Please select your year of study.';
      if (!formData.branch.trim()) newErrors.branch = 'Please fill out this field.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

const handleSubmit = async () => {
  if (validateStep(step)) {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to register for events');
        window.location.href = '/auth';
        return;
      }

      const registrationData = {
        eventId: event.id,
        formData: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          year: formData.year,
          branch: formData.branch,
          reason: formData.reason
        }
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/registrations`,
        registrationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Registration successful:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }
};
  const handleModalClick = (e) => {
    // Only close if clicking the overlay, not the modal content
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <ModalOverlay  onClick={handleModalClick} className='modal-overlay'>
      <Modal >
        <ModalClose onClick={onClose} className='modal-close'>
          <X size={24} />
        </ModalClose>
        
        <ModalHeader >
          <h2
            style={{
              marginRight: "1em"
            }}
          >Register for {event?.title}</h2>
          {!submitted && (
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>
          )}
        </ModalHeader>
        
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step">
                <FormGroup>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </FormGroup>
                
                <div className="form-buttons">
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="form-step">
                <FormGroup>
                  <label htmlFor="college">College Name</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={errors.college ? 'error' : ''}
                  />
                  {errors.college && <div className="error-message">{errors.college}</div>}
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="year">Year of Study</label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={errors.year ? 'error' : ''}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.year && <div className="error-message">{errors.year}</div>}
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="branch">Branch</label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={errors.branch ? 'error' : ''}
                  />
                  {errors.branch && <div className="error-message">{errors.branch}</div>}
                </FormGroup>
                
                <div className="form-buttons">
                  <button type="button" className="btn btn-outline" onClick={prevStep}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="form-step">
                <FormGroup>
                  <label htmlFor="reason">Why do you want to join this event?</label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="5"
                    value={formData.reason}
                    onChange={handleChange}
                    className={errors.reason ? 'error' : ''}
                  ></textarea>
                  {errors.reason && <div className="error-message">{errors.reason}</div>}
                </FormGroup>
                
                <EventSummary>
                  <h3>Event Details</h3>
                  <p><strong>Date:</strong> {event?.date}</p>
                  <p><strong>Time:</strong> {event?.time}</p>
                  <p><strong>Location:</strong> {event?.location}</p>
                </EventSummary>
                
                <div className="form-buttons">
                  <button type="button" className="btn btn-outline" onClick={prevStep}>
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          <SuccessContainer>
            <div className="success-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>Thank you for registering for {event?.title}. We've sent a confirmation email to {formData.email} with all the details.</p>
            <p>We look forward to seeing you at the event!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </SuccessContainer>
        )}
      </Modal>
    </ModalOverlay>
  );
};

export default RegisterModal;