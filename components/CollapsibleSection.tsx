import React, { useState } from 'react';
import { ChevronIcon } from './icons/ChevronIcon';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-700 last:border-b-0">
            <button
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-700/50 focus:outline-none focus:bg-gray-700/50 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`section-content-${title.replace(/\s+/g, '-')}`}
            >
                <h2 className="text-xl font-bold text-gray-100">{title}</h2>
                <ChevronIcon
                    className={`h-6 w-6 text-gray-400 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>
            <div
                id={`section-content-${title.replace(/\s+/g, '-')}`}
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-6 bg-gray-800/30">
                    {children}
                </div>
            </div>
        </div>
    );
};
