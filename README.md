Secure Auth & Email Dashboard Mockup
A full-stack Single Page Application (SPA) demonstrating a secure authentication flow using JWT (JSON Web Tokens), Google OAuth 2.0, and a responsive Email Dashboard UI.

(Place a screenshot of your dashboard here)

🚀 Live Demo

Public Hosting URL: https://fe-ia03-awad.vercel.app 


✨ Features
Authentication:

Sign up & Sign in with Email/Password.


Google Sign-In (OAuth 2.0) integration.


Secure Token Handling: Access Token & Refresh Token rotation.


Automatic Token Refresh: Intercepts 401 errors and refreshes the token silently without logging the user out.


Logout functionality (clears tokens and redirects).

Email Dashboard (Mockup):

Responsive 3-column layout (Folders, Email List, Email Detail).


Protected Routes (requires login to access).

Mock API integration for email data.

🛠 Tech Stack
Frontend: React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, Axios, React Router DOM.

Backend: Node.js, NestJS, Mongoose.

Database: MongoDB Atlas.

Deployment: Vercel (Frontend & Backend).

⚙️ Setup and Run Locally
Follow these instructions to reproduce the deployment locally. 

Prerequisites
Node.js (v18 or higher)

MongoDB URI (local or Atlas)

Google Cloud Console Project (for Client ID & Secret)

1. Backend Setup (NestJS)
Navigate to the server directory:

Bash

cd server
Install dependencies:

Bash

npm install
Create a .env file in the server root and configure the following variables:

Đoạn mã

PORT=8080
DATABASE_URI=mongodb+srv://<your_mongo_connection_string>

# JWT Configuration
JWT_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_EXPIRATION=15m   # Short lived for security
REFRESH_TOKEN_EXPIRATION=7d   # Long lived for session persistence

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/login/oauth/google/callback

# CORS
FRONTEND_URL=http://localhost:5173
Run the server:

Bash

npm run start:dev
The server will run at http://localhost:8080.

2. Frontend Setup (React + Vite)
Navigate to the client directory:

Bash

cd client
Install dependencies:

Bash

npm install
Create a .env file in the client root:

Đoạn mã

VITE_API_URL=http://localhost:8080

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/login/oauth/google/callback
Run the application:

Bash

npm run dev
The app will run at http://localhost:5173.

🔒 Token Storage & Security Considerations
This application implements a secure authentication strategy based on industry standards for SPAs. 


1. Access Token (Short-lived)
Storage: Stored in Application Memory (React Context/State).

Reasoning: Storing access tokens in memory prevents XSS (Cross-Site Scripting) attacks from easily stealing the token, as it is not accessible via document.cookie or localStorage. The token is lost when the tab is closed or refreshed, which is handled by the refresh flow.

2. Refresh Token (Long-lived)
Storage: Stored in LocalStorage.

Reasoning: Used to persist the user's session across page reloads.

Security Note: While HttpOnly Cookies are generally recommended to prevent XSS, LocalStorage was chosen for this project to simplify the implementation of the Automatic Token Refresh mechanism via Axios Interceptors and to avoid Cross-Site Cookie issues on the Vercel Free Tier (which separates FE and BE domains).

Mitigation: To mitigate risks, the Refresh Token is only used to obtain new Access Tokens and cannot be used to directly access protected resources.

3. Automatic Token Refresh
An Axios Interceptor is configured to listen for 401 Unauthorized responses.

When detected, it pauses the failed request, uses the Refresh Token to obtain a new Access Token from the backend, updates the memory state, and retries the original request seamlessly.

☁️ Third-Party Services Used

Google OAuth 2.0: Used for the "Sign in with Google" functionality, allowing users to authenticate using their Google accounts without creating a new password.

MongoDB Atlas: Cloud-hosted NoSQL database for storing user credentials (hashed) and linked account information.

Vercel: Cloud platform used for hosting both the Frontend (Static) and Backend (Serverless Functions).

🧪 How to Test "Simulate Expiry"
To verify the automatic token refresh mechanism:

Log in to the application.

Open the Browser Developer Tools -> Network tab.

Wait for the Access Token to expire (configured to 1 minute for demo purposes).

Click the "Test API Ping" button (or navigate to a protected route).

Observe the Network tab:

Request 1: 401 Unauthorized (Token expired).

Request 2: /auth/refresh (System automatically fetches new token).

Request 3: 200 OK (Original request retried successfully).
