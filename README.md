# InterviewIQ.AI 🚀

An advanced, AI-powered smart mock interview platform that simulates real-world technical and HR interview scenarios. Using artificial intelligence, voice synthesis, speech-to-text, and detailed performance analytics, InterviewIQ.AI helps candidates build confidence, refine communication, and master technical problem-solving.

---

## 🌟 Features

### 🔐 Google Authentication
- Secure login using Firebase Google Auth on the client side.
- Token-based session management using JWT stored in secure HTTP-only cookies on the backend.

### 📄 Intelligent Resume Parsing
- Upload a resume in PDF format.
- Node-level PDF reading using `pdfjs-dist` to extract binary text.
- AI parses and extracts key data: job role, experience level, projects, and technical skills.

### 🎙️ Speech-Activated Voice Interview Simulation
- Responsive voice interview environment.
- Text-to-speech engine using Web Speech Synthesis with natural pacing and warm male/female voices.
- Speech-to-text transcription using browser-native Web Speech Recognition (`webkitSpeechRecognition`).
- Resilient recovery: auto-recovers and restarts if the recognition times out due to silence, handling background noise and pauses gracefully.

### ⏱️ Real-Time Timer & Auto-Submit
- Dynamic countdown timers configured per question difficulty (Easy: 60s, Medium: 90s, Hard: 120s).
- Persistence in database schema prevents issues with timers.
- Automatically records a score of 0 and submits if the timer runs out, but still evaluates the response for study guides.

### 📊 Performance Analytics Dashboard
- Comprehensive evaluation breakdown rating responses (0 to 10) on:
  - **Confidence** (tone, pacing, presentation)
  - **Communication** (clarity, structure, articulation)
  - **Correctness** (accuracy, relevance, completeness)
- Performance trend line charts generated with `Recharts`.
- Generates detailed model answers (**Ideal/Correct Answers**) for every question.
- Downloadable performance report in PDF format generated via `jsPDF` and `jspdf-autotable`.

### 💳 Credits & Payment Gateway
- Flexible packages to buy premium interview credits.
- Complete payment gateway integration using Razorpay payments on frontend and signature verification on backend.

### 📂 History Tracking
- Access past interview dashboards at any time.
- Delete/remove past records securely with ownership validation checks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (v19), Vite, Tailwind CSS (v4), Redux Toolkit (`@reduxjs/toolkit`), Framer Motion (`motion/react`), Recharts, Axios, jsPDF, jspdf-autotable |
| **Backend** | Node.js, Express.js (v5), Mongoose, JSON Web Tokens (`jsonwebtoken`), Multer (disc storage file upload), pdfjs-dist (legacy Node worker build), Razorpay SDK |
| **AI Model** | OpenAI GPT-4o-mini (accessed via OpenRouter API) |
| **Database** | MongoDB Atlas |

---

## 📂 Project Directory Structure

```text
interviewIQ/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Audio, video, and image assets
│   │   ├── components/     # Setup pages, Voice Interview, Report views
│   │   ├── pages/          # Home, Auth, History, Pricing pages
│   │   ├── redux/          # Redux Store and User slices
│   │   └── utils/          # Firebase config & utilities
│   ├── package.json
│   └── vite.config.js
└── server/                 # Express Backend
    ├── config/             # Database connection, token generation
    ├── controllers/        # Auth, Interview, User, and Payment controllers
    ├── middlewares/        # Authentication checks and file uploads
    ├── models/             # User, Interview, and Payment Mongoose schemas
    ├── routes/             # API Router endpoints
    ├── services/           # AI connections (OpenRouter) & Razorpay integration
    └── index.js
```

---

## ⚙️ Environment Configuration

### Client Environment (`client/.env`)
Create a `.env` file in the `client/` folder:
```env
VITE_FIREBASE_APIKEY="your-firebase-api-key"
VITE_RAZORPAY_KEY_ID="your-razorpay-test-key-id"
```

### Server Environment (`server/.env`)
Create a `.env` file in the `server/` folder:
```env
PORT=8000
MONGODB_URL="your-mongodb-connection-string"
JWT_SECRET="your-jwt-signing-secret"
OPENROUTER_API_KEY="your-openrouter-api-key"
VITE_RAZORPAY_KEY_ID="your-razorpay-test-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Connection
- OpenRouter and Razorpay credentials

### Steps to Run

1. **Clone the repository and install dependencies**:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Start the backend server**:
   ```bash
   cd server
   npm run dev
   ```
   The backend server will run on `http://localhost:8000` (or the configured `PORT`).

3. **Start the frontend development server**:
   ```bash
   cd client
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 License
This project is licensed under the ISC License.
