// Convert paise to rupees for display
export const formatPrice = (paise) => {
  if (paise == null) return '₹0.00';
  return `₹${(paise / 100).toFixed(2)}`;
};

// Convert rupees to paise for API
export const toPaise = (rupees) => {
  return Math.round(rupees * 100);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
