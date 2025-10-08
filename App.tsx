import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { CodeInput } from './components/CodeInput';
import { ReviewOutput } from './components/ReviewOutput';
import { LANGUAGES, INITIAL_CODE } from './constants';
import { reviewCode } from './services/geminiService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<string>(LANGUAGES[0].value);
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [review, setReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview('');

    try {
      const result = await reviewCode(code, language);
      setReview(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get review: ${errorMessage}`);
      setReview('');
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  const handleClearCode = useCallback(() => {
    setCode('');
    setReview('');
    setError(null);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 text-white font-sans">
      {/* Left Panel: Input */}
      <div className="w-full md:w-1/2 flex flex-col p-4 sm:p-6 md:p-8">
        <Header />
        <div className="flex flex-col space-y-4 flex-grow min-h-0">
          <LanguageSelector
            languages={LANGUAGES}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <div className="flex-grow flex flex-col min-h-0">
            <label htmlFor="code-input" className="text-sm font-medium text-gray-400 mb-2">
              Your Code
            </label>
            <CodeInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmitReview}
              disabled={isLoading || !code.trim()}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reviewing...
                </>
              ) : (
                'Review Code'
              )}
            </button>
            <button
              onClick={handleClearCode}
              disabled={isLoading || !code.trim()}
              className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Output */}
      <div className="w-full md:w-1/2 bg-gray-800 p-4 sm:p-6 md:p-8 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Review Feedback</h2>
        <div className="flex-grow bg-gray-900 rounded-lg overflow-hidden border border-gray-700/50">
          <ReviewOutput review={review} isLoading={isLoading} error={error} onRetry={handleSubmitReview} />
        </div>
      </div>
    </div>
  );
};

export default App;