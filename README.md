# JobSphere - AI-Powered Job Marketplace

JobSphere is a high-performance, full-stack job marketplace designed for the modern gig economy. It leverages AI to bridge the gap between elite talent and top employers through intelligent matching, automated content generation, and real-time collaboration.

##  Key Features

###  AI-Powered Suite (Google Gemini)
- **AI Resume Architect**: Generate high-impact, professional resumes in Markdown format.
- **AI Proposal Assistant**: Draft tailored job proposals instantly within the application flow.
- **Intelligent Job Matching**: Get real-time job recommendations based on your skill set.

###  Real-Time Collaboration
- **Socket.io Messaging**: Low-latency, real-time chat between freelancers and employers.
- **Persistent History**: Full conversation tracking across sessions.
- **Status Tracking**: Real-time updates on job applications and hiring pipelines.

###  Premium UI/UX
- **Role-Based Dashboards**: Specialized interfaces for Freelancers, Employers, and Admins.
- **Design System**: Built with Tailwind CSS, Plus Jakarta Sans, and Glassmorphism effects.
- **Onboarding Wizard**: Step-by-step profile completion for new users.

###  Secure & Scalable
- **Authentication**: Secure JWT-based auth with role-based access control (RBAC).
- **Architecture**: Clean MVC pattern on the backend for maintainability.
- **Error Resilience**: Integrated Error Boundaries for UI stability.

---

##  Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose, Socket.io |
| **AI** | Google Generative AI (Gemini 1.5 Flash) |
| **Auth** | JWT (JSON Web Tokens), Bcrypt.js |

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/user/jobsphere.git
   cd jobsphere
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📁 Project Structure

```
jobsphere/
├── backend/
│   ├── config/         # Database & Config
│   ├── controllers/    # API Logic
│   ├── middleware/     # Auth & Error middlewares
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   └── server.js       # Main Entry Point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI
    │   ├── context/    # Global State (Auth, Socket)
    │   ├── pages/      # Route Components
    │   └── App.jsx     # Main Routing
```

---

##  Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

##  License
This project is licensed under the MIT License.
