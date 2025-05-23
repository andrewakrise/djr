/**
 * Validates if a string is not empty
 * @param {string} value - The string to validate
 * @returns {boolean} - True if the string is not empty, false otherwise
 */
export const isNotEmpty = (value) => {
  return value.trim().length > 0;
};

/**
 * Validates if a string is a valid email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if the email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a date is valid and not in the past
 * @param {Date} date - The date to validate
 * @returns {boolean} - True if the date is valid and in the future, false otherwise
 */
export const isValidFutureDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate > today;
};

/**
 * Validates if a string is a valid phone number
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if the phone number is valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+1\s?)?(\(\d{3}\)\s?|\d{3}[-\s]?)\d{3}[-\s]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validates if a string meets the minimum length requirement
 * @param {string} value - The string to validate
 * @param {number} minLength - The minimum length required
 * @returns {boolean} - True if the string meets the minimum length, false otherwise
 */
export const meetsMinLength = (value, minLength) => {
  return value.trim().length >= minLength;
};
