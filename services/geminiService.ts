import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Ensure the API key is available. In a real app, this should be handled more securely.
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment.");
}

const ai = new GoogleGenAI({ apiKey });

export async function reviewCode(code: string, language: string): Promise<string> {

  const systemInstruction = `You are an expert software engineer and a world-class code reviewer. Your task is to provide a comprehensive and constructive review of the given code snippet. The code is written in ${language}.

Analyze the code for the following aspects:
1.  **Correctness & Bugs**: Identify any potential bugs, logical errors, or unhandled edge cases.
2.  **Best Practices & Conventions**: Check for adherence to established best practices and language-specific conventions (e.g., naming, style guides).
3.  **Performance**: Suggest potential performance improvements or optimizations.
4.  **Security**: Point out any security vulnerabilities.
5.  **Readability & Maintainability**: Comment on the clarity, organization, and documentation. Suggest ways to make it more readable and maintainable.
6.  **Simplicity & Elegance**: Suggest if there are simpler, more elegant, or more "idiomatic" ways to write the code.

**Output Format**:
Provide your feedback in Markdown format. Structure your review with the following sections:
- A brief **Overall Assessment**.
- A bulleted list of **Specific Suggestions**, each including:
    - The line number(s) if applicable.
    - A clear description of the issue or suggestion.
    - A code snippet showing the "before" and "after" if you suggest a change, using Markdown code fences with the language specified.

Your tone should be professional, helpful, and encouraging.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Please review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the Gemini API.");
  }
}
