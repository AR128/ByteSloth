import React from 'react';
import { CodeIcon } from './icons/CodeIcon';

export const Header: React.FC = () => (
    <div className="flex items-center mb-6 flex-shrink-0">
        <CodeIcon className="h-10 w-10 text-blue-400 mr-4"/>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Gemini Code Reviewer</h1>
            <p className="text-sm sm:text-base text-gray-400">Get instant AI-powered feedback on your code.</p>
        </div>
    </div>
);
