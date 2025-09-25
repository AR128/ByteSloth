import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

// This is the main handler for the Netlify serverless function.
const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API_KEY environment variable not set." }),
    };
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const { code, language } = JSON.parse(event.body || '{}');

    if (!code || !language) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing code or language in request body.' }),
      };
    }
    
    const systemInstruction = `You are an expert software engineer and a world-class code reviewer. Your task is to provide a comprehensive and constructive review of the given code snippet. The code is written in ${language}.

Analyze the code for the following aspects:
1.  **Correctness & Bugs**: Identify any potential bugs, logical errors, or unhandled edge cases.
2.  **Best Practices & Conventions**: Check for adherence to established best practices and language-specific conventions (e.g., naming, style guides).
3.  **Performance**: Suggest potential performance improvements or optimizations.
4.  **Security**: Point out any security vulnerabilities.
5.  **Readability & Maintainability**: Comment on the clarity, organization, and documentation. Suggest ways to make it more readable and maintainable.
6.  **Simplicity & Elegance**: Suggest if there are simpler, more elegant, or more "idiomatic" ways to write the code.

**Output Format**:
Provide your feedback in Markdown format. Structure your review with the following sections using H2 markdown headers (##):
- A brief **Overall Assessment**.
- A bulleted list of **Specific Suggestions**. For each suggestion, you MUST include:
    - The relevant line number(s).
    - A clear description of the issue or suggestion.
    - A code snippet showing the "before" and "after" if you suggest a change, using Markdown code fences with the language specified.

Your tone should be professional, helpful, and encouraging.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        config: {
            systemInstruction: systemInstruction,
        },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: response.text }),
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An error occurred while fetching the review from the Gemini API: ${errorMessage}` }),
    };
  }
};

export { handler };