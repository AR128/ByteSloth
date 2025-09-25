import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/themes/prism-okaidia.css';

interface CodeInputProps {
  value: string;
  onValueChange: (code: string) => void;
  language: string;
}

const languageMap: { [key: string]: string } = {
  html: 'markup',
};

export const CodeInput: React.FC<CodeInputProps> = ({ value, onValueChange, language }) => {
  const prismLanguage = languageMap[language] || language;

  const codeEditorStyles: React.CSSProperties = {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
  };

  const highlightCode = (code: string): string => {
    if (languages[prismLanguage]) {
      try {
        return highlight(code, languages[prismLanguage], prismLanguage);
      } catch (e) {
        console.error("Syntax highlighting error:", e);
        return code;
      }
    }
    return code; // Fallback for unsupported languages
  };

  return (
    <>
      <style>{`
        /* Override prism theme background to match app's bg */
        .code-editor-wrapper pre {
          background: none !important;
        }

        .code-editor-wrapper textarea:focus {
          outline: none;
        }

        /* Sync placeholder styles with editor */
        .code-editor-wrapper textarea::placeholder {
          color: #6b7280; /* Tailwind gray-500 */
        }
      `}</style>
      <div className="w-full h-full flex-grow bg-gray-950 border border-gray-700 rounded-lg text-gray-200 font-mono text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none transition-colors duration-200 hover:border-gray-600 overflow-hidden relative p-4">
        <Editor
          value={value}
          onValueChange={onValueChange}
          highlight={highlightCode}
          padding={0}
          textareaId="code-input"
          placeholder="Paste your code here..."
          style={codeEditorStyles}
          className="w-full h-full overflow-auto code-editor-wrapper"
        />
      </div>
    </>
  );
};
