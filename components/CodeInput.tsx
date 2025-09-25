import React from 'react';

interface CodeInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange }) => (
  <textarea
    id="code-input"
    value={value}
    onChange={onChange}
    placeholder="Paste your code here..."
    className="w-full h-full flex-grow bg-gray-950 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors duration-200 hover:border-gray-600"
    spellCheck="false"
  />
);