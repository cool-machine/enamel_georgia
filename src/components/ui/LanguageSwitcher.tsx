import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'ka' as Language, name: 'ქართული', flag: '🇬🇪' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-800 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLang?.flag} {currentLang?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLanguage(language.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 ${
                currentLanguage === language.code ? 'bg-red-50 text-red-800' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;