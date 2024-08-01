/**
 * Creates a debounced function that delays invoking the provided function
 * until after a specified delay has elapsed since the last time the debounced
 * function was invoked.
 * 
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @returns {Function} Returns the new debounced function.
 */

// utils/debounce.js
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };
  