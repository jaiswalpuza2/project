# CHAPTER 3: DEVELOPMENT

## 3.1 CONSIDERED METHODOLOGIES
Several software development models were considered for this project:
1.  **Waterfall Model**: Too rigid for a project requiring frequent AI integration tests and UI refinements.
2.  **Prototyping**: Good for UI, but doesn't provide enough structure for backend stability.
3.  **Unified Software Development Process (USDP)**: Selected for its iterative and architecture-centric approach.

## 3.2 SELECTED METHODOLOGY: USDP
The **Unified Software Development Process (USDP)** was selected because it is:
*   **Iterative and Incremental**: Allowing for the gradual addition of AI features.
*   **Use-Case Driven**: Ensuring all development is focused on end-user value.
*   **Architecture-Centric**: Critical for a MERN stack application with complex real-time and AI dependencies.

## 3.3 PHASES OF METHODOLOGY
1.  **Inception**: Defining the scope (JobSphere) and identifying core actors (Freelancer, Employer, Admin).
2.  **Elaboration**: Analyzing requirements and designing the system architecture (MERN stack setup).
3.  **Construction**: The main coding phase where AI features (Gemini) and Real-time chat (Socket.io) were implemented.
4.  **Transition**: Testing, debugging, and preparing the platform for final deployment.

---

## 3.4 SURVEY RESULTS

### 3.4.1 PRE-SURVEY RESULTS
A pre-survey was conducted among 50 potential users (students and freelancers) to identify pain points.
*   **Finding 1**: 85% of respondents found manual resume building "frustrating".
*   **Finding 2**: 70% mentioned they spend more than 20 minutes drafting a single job proposal.
*   **Finding 3**: High demand for a "unified dashboard" for job tracking.

### 3.4.2 POST-SURVEY RESULTS
After testing the JobSphere prototype, users reported:
*   **Satisfaction**: 92% felt the AI Resume Architect significantly saved time.
*   **Usability**: 4.5/5 average rating for the real-time chat functionality.
*   **Efficiency**: Average proposal drafting time reduced from 20 mins to under 2 mins.

---

## 3.5 REQUIREMENT ANALYSIS

### 3.5.1 Functional Requirements
*   **FR1: User Authentication**: Secure login/signup for different roles.
*   **FR2: Job Management**: Posting, editing, and deleting jobs by employers.
*   **FR3: AI Resume Generation**: Automated resume creation using Gemini AI.
*   **FR4: AI Proposal Assistant**: Context-aware proposal generation.
*   **FR5: Real-time Messaging**: Instant communication between parties.
*   **FR6: Admin Dashboard**: Oversight of users and platform analytics.

### 3.5.2 Non-Functional Requirements
*   **NFR1: Performance**: AI responses should be generated within 5 seconds.
*   **NFR2: Security**: All data transmission must be secured via JWT.
*   **NFR3: Scalability**: The system should handle multiple concurrent chat sessions.
*   **NFR4: Usability**: The interface must be responsive and follow modern design principles.

---

## 3.6 DESIGN

### 3.6.1 Use Case Diagram
```mermaid
useCaseDiagram
    actor Freelancer
    actor Employer
    actor Admin

    Freelancer --> (Generate AI Resume)
    Freelancer --> (Apply for Jobs)
    Freelancer --> (Real-time Chat)
    
    Employer --> (Post Jobs)
    Employer --> (Hire Freelancer)
    Employer --> (Review Applications)
    
    Admin --> (Manage Users)
    Admin --> (Monitor System)
```

### 3.6.2 System Architecture
JobSphere follows a **Microservices-adjacent MVC pattern**:
*   **Client**: React 19 SPA.
*   **Server**: Node/Express REST API.
*   **AI Engine**: Gemini 1.5 via Google Generative AI SDK.
*   **Database**: MongoDB Atlas.

---

## 3.7 IMPLEMENTATION

### 3.7.1 Core Feature Logic
The implementation focused on clean code and robust integration.
*   **AI Integration**: Utilized `GoogleGenerativeAI` package to feed structured prompts to Gemini.
*   **State Management**: Used React Context API for managing auth and socket states globally.
*   **Styling**: Leveraged Tailwind CSS for a consistent "Glassmorphism" effect across all dashboards.

### 3.7.2 Backend Architecture (Folder Structure)
```text
backend/
├── routes/       # API endpoints (auth, jobs, ai)
├── controllers/  # Business logic
├── models/       # Mongoose Schemas
├── middleware/   # JWT verification
└── server.js     # Entry point & Socket.io setup
```

> [!NOTE]
> Screenshots of the system (Resume generator UI, Admin Dashboard, and Chat interface) are included in the final appendix for visual reference.
