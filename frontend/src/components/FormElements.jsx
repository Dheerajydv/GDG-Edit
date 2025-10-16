import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 550px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.colors.borderRadius?.medium};
  box-shadow: ${({ theme }) => theme.colors.shadows?.medium};
  position: relative;
  overflow: hidden;
  z-index: 1;

  @media (max-width: 500px) {
    max-width: 100%;
    padding: 24px 16px;
    border-radius: ${({ theme }) => theme.colors.borderRadius?.small};
  }
`;
export const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const Logo = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 40px;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Input = styled.input`
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.colors.borderRadius?.small};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.colors.transitions?.default};
  outline: none;
  
  &:focus {
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.7;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.text};
`;

export const ErrorMessage = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 6px;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const Checkbox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.colors.borderRadius?.small};
  background-color: ${({ theme }) => theme.colors?.surface};
  display: inline-block;
  position: relative;
  margin: 0;
  cursor: pointer;
  transition: all ${({ theme }) => theme.colors.transitions?.default};
  
  &:checked {
    background-color: ${({ theme }) => theme.colors.text.secondary};
    border-color: ${({ theme }) => theme.colors.text.primary};
    
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 5px;
      width: 5px;
      height: 10px;
      border-right: 2px solid white;
      border-bottom: 2px solid white;
      transform: rotate(45deg);
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.colors.borderRadius?.small};
  background: ${({ theme, variant }) => 
    variant === 'secondary' ? 'transparent' : theme.colors.primary};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.primary : '#FFFFFF'};
  border: ${({ theme, variant }) => 
    variant === 'secondary' ? `2px solid ${theme.colors.primary}` : 'none'};
  box-shadow: ${({ theme, variant }) => 
    variant === 'secondary' ? 'none' : theme.shadows?.small};
  transition: all ${({ theme }) => theme.transitions?.default};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'secondary' ? `${theme.colors.primary}15` : theme.colors.blue?.tertiary};
    transform: translateY(-2px);
    box-shadow: ${({ theme, variant }) => 
      variant === 'secondary' ? 'none' : theme.colors.shadows?.medium};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.text.primary}33`};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SocialButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.colors.borderRadius?.small};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.colors.transitions?.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    box-shadow: ${({ theme }) => theme.shadows?.small};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.text.tertiary}`};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.divider};
  }
  
  span {
    padding: 0 10px;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
  }
`;

export const SwitchText = styled.p`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 20px;
  
  a {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PasswordStrength = styled.div`
  margin-top: 8px;
`;

export const StrengthBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  margin-bottom: 6px;
  overflow: hidden;
`;

export const StrengthIndicator = styled.div`
  height: 100%;
  width: ${({ strength }) => `${strength}%`};
  background: ${({ theme, strength }) => {
    if (strength < 33) return theme.colors.error;
    if (strength < 66) return theme.colors.accent2;
    return theme.colors.success;
  }};
  transition: width 0.3s ease, background-color 0.3s ease;
`;

export const StrengthText = styled.span`
  font-size: 12px;
  color: ${({ theme, strength }) => {
    if (strength < 33) return theme.colors.error;
    if (strength < 66) return theme.colors.accent2;
    return theme.colors.success;
  }};
`;

export const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
`;