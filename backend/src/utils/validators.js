// MoveSmart — Validation Helpers

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) => typeof password === 'string' && password.length >= 6;
