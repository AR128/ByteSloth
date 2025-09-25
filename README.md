# Gemini Code Reviewer

This is a secure, serverless code review application powered by the Gemini API, built with React and Vite, and designed for easy deployment on Netlify.

## How It Works

The application uses a secure architecture where the frontend (React) does not have access to the API key. Instead, it sends the code to a Netlify serverless function, which then securely calls the Gemini API using an environment variable.

-   **Frontend:** A React application built with Vite for a fast, modern development experience and an optimized production build.
-   **Backend:** A Netlify Function (`/netlify/functions/review.ts`) that acts as a secure proxy to the Gemini API.

---

## Local Development

To run this project on your local machine, you'll need to run both the frontend (Vite) and the serverless function (Netlify CLI) at the same time.

### 1. Installation

First, install the project dependencies and the Netlify CLI:

```bash
# Install project dependencies
npm install

# Install Netlify CLI globally
npm install netlify-cli -g
```

### 2. Add Your API Key

Create a new file in the root of the project named `.env` and add your Gemini API key:

```
# .env file
API_KEY=Your_Secret_Gemini_API_Key
```
*(You can get your key from [Google AI Studio](https://aistudio.google.com/)). This file is already in `.gitignore` to prevent you from accidentally committing your key.*

### 3. Run the Development Servers

Open two separate terminal windows:
-   In **Terminal 1**, start the Netlify dev server, which will run your serverless function:
    ```bash
    netlify dev
    ```
-   In **Terminal 2**, start the Vite dev server for the frontend:
    ```bash
    npm run dev
    ```
You can now access the application at the local address provided by Vite (usually `http://localhost:5173`).

---

## Deployment to Netlify

Deploying your site is simple thanks to the new project configuration.

### Step 1: Push to a Git Repository

Push the project code to a new repository on GitHub, GitLab, or Bitbucket.

### Step 2: Create a New Site on Netlify

1.  Log in to your Netlify account.
2.  Click **"Add new site"** > **"Import an existing project"**.
3.  Connect to your Git provider and select the repository you just created.

### Step 3: Configure Build Settings

Netlify will automatically detect and apply the correct settings from the `netlify.toml` file included in the project. You shouldn't need to change anything.
-   **Build command:** `npm run build`
-   **Publish directory:** `dist`

### Step 4: Add the Gemini API Key (Crucial Step)

1.  In your Netlify site dashboard, go to **Site settings** > **Build & deploy** > **Environment**.
2.  Under **Environment variables**, click **"Edit variables"**.
3.  Click **"New variable"**.
4.  For the **Key**, enter exactly: `API_KEY`
5.  For the **Value**, paste your secret Gemini API key.
6.  Click **"Save"**.

### Step 5: Deploy

Trigger a new deploy from your Netlify dashboard. Netlify will build your site and deploy the serverless function. Once complete, your code reviewer will be live!
