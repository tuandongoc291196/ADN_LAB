// client/src/utils/helpers.js

/**
 * Format currency in Vietnamese format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date in Vietnamese format
 * @param {string} dateString - Date string to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formatOptions = { ...defaultOptions, ...options };
  
  return new Date(dateString).toLocaleDateString('vi-VN', formatOptions);
};

/**
 * Format date with weekday
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date with weekday
 */
export const formatDateWithWeekday = (dateString) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

/**
 * Format time in HH:MM format
 * @param {string} timeString - Time string to format
 * @returns {string} Formatted time
 */
export const formatTime = (timeString) => {
  return timeString; // Already in HH:MM format
};

/**
 * Get service type display name
 * @param {string} serviceType - Service type ('civil' or 'administrative')
 * @returns {string} Display name
 */
export const getServiceTypeDisplayName = (serviceType) => {
  switch (serviceType) {
    case 'administrative':
      return 'ADN Hành chính';
    case 'civil':
      return 'ADN Dân sự';
    default:
      return 'Không xác định';
  }
};

/**
 * Get collection method display name
 * @param {string} methodId - Method ID
 * @returns {string} Display name
 */
export const getCollectionMethodDisplayName = (methodId) => {
  switch (methodId) {
    case 'self-sample':
      return 'Lấy mẫu tại nhà';
    case 'home-visit':
      return 'Nhân viên tới nhà lấy mẫu';
    case 'at-facility':
      return 'Tới cơ sở lấy mẫu';
    default:
      return 'Không xác định';
  }
};

/**
 * Get appointment status badge variant
 * @param {string} status - Status string
 * @returns {string} Bootstrap variant
 */
export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'confirmed':
      return 'primary';
    case 'in-progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'pending':
      return 'secondary';
    default:
      return 'secondary';
  }
};

/**
 * Get appointment status display text
 * @param {string} status - Status string
 * @returns {string} Display text
 */
export const getStatusDisplayText = (status) => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'in-progress':
      return 'Đang thực hiện';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    case 'pending':
      return 'Chờ xử lý';
    default:
      return 'Không xác định';
  }
};

/**
 * Get payment status badge variant
 * @param {string} status - Payment status
 * @returns {string} Bootstrap variant
 */
export const getPaymentStatusBadgeVariant = (status) => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'danger';
    case 'refunded':
      return 'info';
    default:
      return 'secondary';
  }
};

/**
 * Get payment status display text
 * @param {string} status - Payment status
 * @returns {string} Display text
 */
export const getPaymentStatusDisplayText = (status) => {
  switch (status) {
    case 'paid':
      return 'Đã thanh toán';
    case 'pending':
      return 'Chờ thanh toán';
    case 'failed':
      return 'Thanh toán thất bại';
    case 'refunded':
      return 'Đã hoàn tiền';
    default:
      return 'Không xác định';
  }
};

/**
 * Get payment method display text
 * @param {string} method - Payment method
 * @returns {string} Display text
 */
export const getPaymentMethodDisplayText = (method) => {
  switch (method) {
    case 'credit_card':
      return 'Thẻ tín dụng';
    case 'bank_transfer':
      return 'Chuyển khoản ngân hàng';
    case 'cash':
      return 'Tiền mặt';
    case 'e_wallet':
      return 'Ví điện tử';
    default:
      return method;
  }
};

/**
 * Get result status badge variant
 * @param {string} result - Result status
 * @returns {string} Bootstrap variant
 */
export const getResultBadgeVariant = (result) => {
  switch (result) {
    case 'positive':
      return 'success';
    case 'negative':
      return 'danger';
    case 'inconclusive':
      return 'warning';
    default:
      return 'secondary';
  }
};

/**
 * Get result status display text
 * @param {string} result - Result status
 * @returns {string} Display text
 */
export const getResultDisplayText = (result) => {
  switch (result) {
    case 'positive':
      return 'Xác nhận quan hệ';
    case 'negative':
      return 'Loại trừ quan hệ';
    case 'inconclusive':
      return 'Không kết luận';
    default:
      return 'Chưa có kết quả';
  }
};

/**
 * Generate appointment ID
 * @returns {string} Generated ID
 */
export const generateAppointmentId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `ADN${timestamp}`;
};

/**
 * Check if date is in the future
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if date is in future
 */
export const isUpcomingDate = (dateString) => {
  return new Date(dateString) > new Date();
};

/**
 * Check if appointment can be cancelled
 * @param {string} dateString - Appointment date
 * @param {string} timeString - Appointment time
 * @returns {boolean} True if can be cancelled
 */
export const canCancelAppointment = (dateString, timeString) => {
  const appointmentDateTime = new Date(`${dateString}T${timeString}`);
  const now = new Date();
  const hoursDiff = (appointmentDateTime - now) / (1000 * 60 * 60);
  return hoursDiff > 24; // Can cancel if more than 24 hours before
};

/**
 * Check if appointment can be rescheduled
 * @param {string} dateString - Appointment date
 * @param {string} timeString - Appointment time
 * @param {string} status - Appointment status
 * @returns {boolean} True if can be rescheduled
 */
export const canRescheduleAppointment = (dateString, timeString, status) => {
  if (status !== 'confirmed') return false;
  return canCancelAppointment(dateString, timeString);
};

/**
 * Generate available time slots
 * @returns {string[]} Array of time slots
 */
export const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8;
  const endHour = 17;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Skip lunch break (12:00-13:30)
    if (hour === 12) continue;
    
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour !== endHour) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  
  return slots;
};

/**
 * Generate available dates (next 30 days, excluding Sundays)
 * @returns {string[]} Array of date strings
 */
export const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays (0 = Sunday)
    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  
  return dates;
};

/**
 * Calculate progress percentage
 * @param {string} status - Current status
 * @param {string} serviceType - Service type
 * @returns {number} Progress percentage
 */
export const calculateProgress = (status, serviceType = 'civil') => {
  const progressMap = {
    civil: {
      'confirmed': 20,
      'kit-sent': 40,
      'sample-received': 60,
      'in-progress': 80,
      'completed': 100,
      'cancelled': 0
    },
    administrative: {
      'confirmed': 25,
      'sample-collected': 50,
      'in-progress': 75,
      'completed': 100,
      'cancelled': 0
    }
  };
  
  return progressMap[serviceType]?.[status] || 0;
};

/**
 * Render star rating
 * @param {number} rating - Rating value (1-5)
 * @returns {JSX.Element[]} Array of star elements
 */
export const renderStarRating = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <i
      key={index}
      className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
    />
  ));
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate phone number (Vietnamese format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate ID number (Vietnamese CCCD/CMND)
 * @param {string} idNumber - ID number to validate
 * @returns {boolean} True if valid
 */
export const validateIdNumber = (idNumber) => {
  // CCCD: 12 digits, CMND: 9 digits
  const cccdRegex = /^[0-9]{12}$/;
  const cmndRegex = /^[0-9]{9}$/;
  return cccdRegex.test(idNumber) || cmndRegex.test(idNumber);
};

/**
 * Get file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Calculate age from birth date
 * @param {string} birthDate - Birth date string
 * @returns {number} Age in years
 */
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if user is minor (under 18)
 * @param {string} birthDate - Birth date string
 * @returns {boolean} True if minor
 */
export const isMinor = (birthDate) => {
  return calculateAge(birthDate) < 18;
};