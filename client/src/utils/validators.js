export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  },

  required: (value) => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return !value || value.length <= max;
  },

  numeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  date: (value) => {
    return !isNaN(Date.parse(value));
  },

  futureDate: (value) => {
    return new Date(value) > new Date();
  },
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    fieldRules.forEach((rule) => {
      if (rule.required && !validators.required(value)) {
        errors[field] = rule.message || `${field} is required`;
      } else if (value && rule.type && !validators[rule.type](value)) {
        errors[field] = rule.message || `Invalid ${field}`;
      } else if (value && rule.min && !validators.minLength(value, rule.min)) {
        errors[field] = rule.message || `${field} must be at least ${rule.min} characters`;
      } else if (value && rule.max && !validators.maxLength(value, rule.max)) {
        errors[field] = rule.message || `${field} must be at most ${rule.max} characters`;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
