import React, { useMemo } from 'react';
import { PasswordStrength, StrengthBar, StrengthIndicator, StrengthText } from './FormElements';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 15; // uppercase
    if (/[a-z]/.test(password)) strength += 15; // lowercase
    if (/[0-9]/.test(password)) strength += 15; // numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // special chars
    
    // Penalize repetition and sequences
    if (/(.)\\1{2,}/.test(password)) strength -= 10;
    if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(password.toLowerCase())) strength -= 10;
    
    return Math.max(0, Math.min(100, strength));
  };
  
  const strengthValue = useMemo(() => calculateStrength(password), [password]);
  
  const getStrengthText = (strength) => {
    if (!password) return '';
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  if (!password) return null;
  
  return (
    <PasswordStrength>
      <StrengthBar>
        <StrengthIndicator strength={strengthValue} />
      </StrengthBar>
      <StrengthText strength={strengthValue}>
        {getStrengthText(strengthValue)}
      </StrengthText>
    </PasswordStrength>
  );
};

export default PasswordStrengthMeter;