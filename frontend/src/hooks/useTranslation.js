import { useCallback } from 'react';
import { t, getLanguage, setLanguage } from '../locales';

export const useTranslation = () => {
  const currentLang = getLanguage();
  
  const translate = useCallback((key, params = {}) => {
    return t(key, params);
  }, []);
  
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    return lang;
  }, []);
  
  return {
    t: translate,
    currentLang,
    changeLanguage,
    dir: currentLang === 'ar' ? 'rtl' : 'ltr'
  };
};