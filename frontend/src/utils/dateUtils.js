import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
};

export const formatTime = (timeString) => {
  // If timeString is already formatted, return it
  if (timeString.includes(':') && (timeString.includes('AM') || timeString.includes('PM'))) {
    return timeString;
  }
  
  // Otherwise, format it
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    return timeString; // If unable to format, return original
  }
};