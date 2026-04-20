# CHAPTERS 6, 7 & 8: DOCUMENTATION AND APPENDIX

## CHAPTER 6: REFERENCES
1.  **React 19 Documentation**: https://react.dev/
2.  **Node.js API Reference**: https://nodejs.org/api/
3.  **Google Gemini AI Documentation**: https://ai.google.dev/docs
4.  **Socket.io Documentation**: https://socket.io/docs/v4/
5.  **MongoDB Mongoose Documentation**: https://mongoosejs.com/docs/

## CHAPTER 7: BIBLIOGRAPHY
1.  *Design Patterns: Elements of Reusable Object-Oriented Software* by Erich Gamma et al.
2.  *Clean Code: A Handbook of Agile Software Craftsmanship* by Robert C. Martin.
3.  *Artificial Intelligence: A Modern Approach* by Stuart Russell and Peter Norvig.
4.  *The Unified Software Development Process* by Ivar Jacobson, Grady Booch, and James Rumbaugh.

---

## CHAPTER 8: APPENDIX

### 8.1 APPENDIX A: PRE-SURVEY
#### 8.1.1 PRE-SURVEY FORM
The pre-survey consisted of questions regarding current job-seeking frustrations, time spent on resumes, and interest in AI tools.
#### 8.1.2 SAMPLE OF FILLED PRE-SURVEY FORMS (Digital Record)
Stored in the project's data repository under `/docs/surveys/pre_survey_samples.pdf`.
#### 8.1.3 PRE-SURVEY RESULT
Summarized in Chapter 3.4.1.

### 8.2 APPENDIX B: POST-SURVEY
#### 8.2.1 POST-SURVEY FORM
Questions focused on functionality, UI/UX satisfaction, and efficiency gains from AI features.
#### 8.2.3 POST-SURVEY RESULT
Summarized in Chapter 3.4.2.

### 8.3 APPENDIX C: SAMPLE CODES
#### 8.3.1 SAMPLE CODE OF THE UI (React Dashboard)
```javascript
// Example of Dashboard Layout Component
const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar role={role} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
```
#### 8.3.2 SAMPLE CODE FOR THE AUTOMATION SCRIPT (AI Integration)
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateResume(userData) {
  const prompt = `Generate a professional resume for: ${JSON.stringify(userData)}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 8.4 APPENDIX D: DESIGNS
#### 8.4.1 GANTT CHART
*(Image placeholder: /docs/report/images/gantt_chart.png)*
#### 8.4.2 WORK BREAKDOWN STRUCTURE
*   Phase 1: Research and Planning
*   Phase 2: Database and API Development
*   Phase 3: AI Integration
*   Phase 4: Frontend UI Construction
*   Phase 5: Testing and Deployment
#### 8.4.3 ALGORITHMS & FLOWCHARTS
Refer to Chapter 3.6 for specialized logic flow.
#### 8.4.6 DATA FLOW DIAGRAMS
*(Image placeholder: /docs/report/images/dfd_level1.png)*
#### 8.4.7 USE CASE
Detailed in Chapter 3.6.1.
#### 8.4.8 WIREFRAME
*(Image placeholder: /docs/report/images/wireframes_v1.png)*

### 8.5 APPENDIX E: SCREENSHOTS OF THE SYSTEM
1.  **Home Page**: Showcasing the hero section and features.
2.  **Freelancer Dashboard**: AI Resume Builder interface.
3.  **Employer Dashboard**: Job management and applicant list.
4.  **Admin Dashboard**: Platform analytics and user overview.
5.  **Real-time Chat**: Interaction between two users.

### 8.6 APPENDIX F: USER FEEDBACK
Summarized qualitative feedback highlighting the "ease of use" and "speed of AI generation" as top appreciated features.

### 8.7 APPENDIX G: FUTURE WORK
Readings related to Blockchain Escrows and Mobile UX patterns for gig marketplaces.
