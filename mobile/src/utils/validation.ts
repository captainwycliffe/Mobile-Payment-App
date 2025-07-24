export interface ValidationResult {
    isValid: boolean;
    errors: { [key: string]: string };
  }
  
  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };
  
  export const validateAmount = (amount: string): boolean => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 10000;
  };
  
  export const validateLoginForm = (email: string, password: string): ValidationResult => {
    const errors: { [key: string]: string } = {};
  
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email';
    }
  
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  export const validateSignupForm = (
    email: string,
    password: string,
    confirmPassword: string
  ): ValidationResult => {
    const errors: { [key: string]: string } = {};
  
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email';
    }
  
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters';
    }
  
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  export const validatePaymentForm = (
    recipient: string,
    amount: string
  ): ValidationResult => {
    const errors: { [key: string]: string } = {};
  
    if (!recipient.trim()) {
      errors.recipient = 'Recipient is required';
    } else if (recipient.trim().length < 2) {
      errors.recipient = 'Recipient name must be at least 2 characters';
    }
  
    if (!amount.trim()) {
      errors.amount = 'Amount is required';
    } else if (!validateAmount(amount)) {
      errors.amount = 'Please enter a valid amount (0.01 - 10,000)';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  