import dayjs from 'dayjs';

export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

export const formatTime = (date) => {
  return dayjs(date).format('HH:mm:ss');
};

export const formatRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
