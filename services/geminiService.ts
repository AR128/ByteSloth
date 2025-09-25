// ===================================================================================
//
//                          IMPORTANT SECURITY NOTICE
//
// ===================================================================================
//
// This file does not contain any active code. It serves as an important notice
// regarding the application's architecture and API key security.
//
//
// 1. API Calls are Handled on the Backend:
// ----------------------------------------
// All communication with the Gemini API is handled exclusively by a serverless
// function located at `/netlify/functions/review.ts`. This is a deliberate
// security design to prevent the API key from ever being exposed in the
// frontend (i.e., in the user's browser).
//
//
// 2. API Key Configuration:
// -------------------------
// The API key is NOT configured in this frontend code. Instead, it must be
// provided as a secure environment variable to your hosting provider (e.g., Netlify).
//
//   - Variable Name:  API_KEY
//   - Value:          Your_Secret_Gemini_API_Key
//
// The serverless function reads this environment variable securely on the server side.
// Direct usage of `process.env.API_KEY` or any other API key reference is
// intentionally absent from the frontend codebase.
//
//
// For detailed deployment instructions, please refer to the README.md file.
//
// ===================================================================================
