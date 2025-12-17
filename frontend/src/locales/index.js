// Default to Arabic as per your preference
const defaultLanguage = 'ar';

// Get language from localStorage or use default
export const getLanguage = () => {
  return localStorage.getItem('lang') || defaultLanguage;
};

// Set language
export const setLanguage = (lang) => {
  localStorage.setItem('lang', lang);
  // You can reload the page or update state in your components
  return lang;
};

// Import your translations
import { translations } from '../translations';

// Translation function
export const t = (key, params = {}) => {
  const lang = getLanguage();
  
  // Get translation
  let text = translations[lang]?.[key] || translations[defaultLanguage]?.[key] || key;
  
  // Replace parameters like {name} with actual values
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
};

// Get direction for current language
export const getDirection = () => {
  return getLanguage() === 'ar' ? 'rtl' : 'ltr';
};

// Export everything
export default { t, setLanguage, getLanguage, getDirection };