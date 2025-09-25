import React from 'react';
import { Language } from '../constants';

interface LanguageSelectorProps {
  languages: Language[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, value, onChange }) => (
  <div>
    <label htmlFor="language-selector" className="text-sm font-medium text-gray-400 mb-2 block">
      Language
    </label>
    <select
      id="language-selector"
      value={value}
      onChange={onChange}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200 hover:border-blue-600"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.name}
        </option>
      ))}
    </select>
  </div>
);