export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePrice = (price) => {
  return price > 0;
};

export const validateStock = (stock) => {
  return stock >= 0;
};

export const validateRating = (rating) => {
  return rating >= 1 && rating <= 5;
};