import React, { useState } from 'react';
import { Mail, MapPin, Users } from 'lucide-react';
import './ContactSection.css';
import styled from 'styled-components';

const Contact = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: var(--spacing-lg) 0;
`;

const Container = styled.div`
  width: fit-content;
  margin: 0 auto var(--spacing-lg);
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: var(--font-size-lg);

  h2 {
    text-align: center;
    color: ${({ theme }) => theme.colors.text.primary};
  }
  p {
    text-align: center;
    max-width: 800px;
    margin: 0 auto var(--spacing-lg);
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: var(--font-size-lg);
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }
`;

const Info = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 4px 20px var(--shadow-color);
  position: relative;
  overflow: hidden;
  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  h4 {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ContactContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ContactForm = styled.form`
  background-color: ${({ theme }) => theme.colors.background.primary};

  label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: var(--spacing-sm);
    border: ${({ theme }) => theme.googleColors.borders};
    border-radius: var(--radius-md);
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: border-color var(--transition-short), box-shadow var(--transition-short);
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
  }

  input.error,
  textarea.error {
    border-color: var(--accent-color);
  }
`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatusMessage('Sending...');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setStatusMessage('✅ Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err.message);
      setStatusMessage('❌ Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <Contact id="contact">
      <Container>
        <h2 className="section-title">Get In Touch</h2>
        <p>
          Have questions about GDG MMMUT or interested in collaborating? We'd love to hear from
          you! Reach out to us through any of the channels below.
        </p>

        <ContactGrid>
          {/* Left side */}
          <Info>
            <h3>Contact GDG On Campus MMMUT</h3>

            <div className="contact-method">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div className="contact-details">
                <h4>Email Us</h4>
                <a href="mailto:mmmutdsc@gmail.com">mmmutdsc@gmail.com</a>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-details">
                <h4>Visit Us</h4>
                <p>MMMUT Campus, Gorakhpur, Uttar Pradesh, India</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <Users size={24} />
              </div>
              <div className="contact-details">
                <h4>Join Community</h4>
                <a
                  href="https://gdg.community.dev/gdg-on-campus-madan-mohanmalaviya-university-of-technology-gorakhpur-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GDG On Campus MMMUT
                </a>
              </div>
            </div>

            <div className="quick-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/events">Upcoming Events</a></li>
                <li><a href="#about">About GDG On Campus MMMUT</a></li>
                <li><a href="https://gdg.community.dev/" target="_blank" rel="noopener noreferrer">Google Developer Groups</a></li>
                <li><a href="https://developers.google.com/community" target="_blank" rel="noopener noreferrer">GDG Community Page</a></li>
              </ul>
            </div>
          </Info>

          {/* Right side */}
          <ContactContainer>
            <h3>We’d Love to Hear from You</h3>

            {statusMessage && <div className="status-message">{statusMessage}</div>}

            <ContactForm onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div>
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  placeholder="Your Subject"
                />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Write your message here..."
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className={`btn btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </ContactForm>
          </ContactContainer>
        </ContactGrid>
      </Container>
    </Contact>
  );
};

export default ContactSection;
