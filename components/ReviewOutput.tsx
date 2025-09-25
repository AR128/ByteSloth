import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Loader } from './Loader';
import { CollapsibleSection } from './CollapsibleSection';

interface ReviewOutputProps {
  review: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const Placeholder: React.FC = () => (
    <div className="flex items-center justify-center h-full text-center text-gray-500 p-4">
        <div>
            <h3 className="text-lg font-semibold text-gray-400">Ready to Review</h3>
            <p>Your code review feedback will appear here once you submit your code.</p>
            <p className="text-xs text-gray-600 mt-4 italic">
                Note for developers: For this application to function after deployment, ensure the Gemini <code>API_KEY</code> is set in your hosting environment variables. See README.md for details.
            </p>
        </div>
    </div>
);

const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(error).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return (
        <div className="m-4 sm:m-6 p-4 sm:p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300">
            <div className="flex items-start mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-bold text-lg text-red-200">An Error Occurred</h3>
            </div>
            <p className="bg-gray-950 p-3 rounded-md font-mono text-sm mb-4 break-words">{error}</p>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out"
                >
                    Retry
                </button>
                <button
                    onClick={handleCopy}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out w-32 text-center"
                >
                    {isCopied ? 'Copied!' : 'Copy Error'}
                </button>
            </div>
        </div>
    );
};

export const ReviewOutput: React.FC<ReviewOutputProps> = ({ review, isLoading, error, onRetry }) => {
    
    const parsedContent = useMemo(() => {
        if (!review) return null;

        const parts = review.split(/(^## .+$)/m);
        const initialContent = parts[0] ? parts[0].trim() : '';

        const sections = [];
        for (let i = 1; i < parts.length; i += 2) {
            const title = parts[i].replace(/^## /, '').trim();
            const content = parts[i + 1] ? parts[i + 1].trim() : '';
            if (title && content) {
                sections.push({ title, content });
            }
        }
        
        return { initialContent, sections };
    }, [review]);

    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return <ErrorDisplay error={error} onRetry={onRetry} />;
        }
        if (review && parsedContent) {
            const markdownComponents = {
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-7" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-3" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-3" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-100" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="bg-gray-800/50 border-l-4 border-blue-400 pl-4 italic text-gray-300 my-4 py-2" {...props} />,
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <div className="my-4 rounded-lg overflow-hidden border border-gray-700/50">
                            <div className="text-xs text-gray-400 font-sans uppercase tracking-wide bg-gray-800/40 px-4 py-2 border-b border-gray-700/50">
                                Code Example
                            </div>
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ 
                                    margin: 0, 
                                    borderRadius: 0,
                                    backgroundColor: '#1E1E1E'
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-gray-700 text-amber-300 rounded-md px-1.5 py-1 text-sm font-mono" {...props}>
                            {children}
                        </code>
                    );
                },
            };
            return (
                 <div className="p-4 sm:p-6 text-gray-300">
                    {parsedContent.initialContent && (
                       <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                ...markdownComponents,
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4" {...props} />,
                            }}
                       >
                           {parsedContent.initialContent}
                       </ReactMarkdown>
                    )}
                    {parsedContent.sections.map(({ title, content }, index) => (
                        <CollapsibleSection key={index} title={title}>
                             <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                            >
                                {content}
                            </ReactMarkdown>
                        </CollapsibleSection>
                    ))}
                </div>
            );
        }
        return <Placeholder />;
    };

    return (
        <div className="h-full w-full overflow-y-auto">
            {renderContent()}
        </div>
    );
};