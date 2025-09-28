import toast from 'react-hot-toast';

// Default toast styles
const defaultStyle = {
  borderRadius: '8px',
  fontWeight: '500',
  fontSize: '14px',
};

// Success toast
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 2000,
    position: 'top-center',
    style: {
      ...defaultStyle,
      background: '#10B981',
      color: '#fff',
    },
    ...options,
  });
};

// Error toast
export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      ...defaultStyle,
      background: '#EF4444',
      color: '#fff',
    },
    ...options,
  });
};

// Warning toast
export const showWarningToast = (message, options = {}) => {
  return toast(message, {
    duration: 2500,
    position: 'top-center',
    style: {
      ...defaultStyle,
      background: '#F59E0B',
      color: '#fff',
    },
    icon: '⚠️',
    ...options,
  });
};

// Info toast
export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    duration: 2000,
    position: 'top-center',
    style: {
      ...defaultStyle,
      background: '#3B82F6',
      color: '#fff',
    },
    icon: 'ℹ️',
    ...options,
  });
};

// Login required toast
export const showLoginRequiredToast = () => {
  return showWarningToast('Please login to continue', {
    icon: '🔐',
  });
};