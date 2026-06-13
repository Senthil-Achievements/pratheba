# ResumeScan

ResumeScan is an AI-powered ATS resume checker designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume, paste the job description, and get an instant ATS score with AI-powered suggestions that tell you exactly what to fix.

## 🚀 Features

- **ATS Match Score:** Get a quantifiable score of how well your resume matches the job description.
- **Keyword Gap Analysis:** Identify missing keywords that are critical for the role.
- **Section Completeness:** Ensure your resume has all the necessary standard sections.
- **Formatting Checker:** Verify your resume format is ATS-friendly.
- **AI Smart Suggestions:** Powered by AI to give you actionable feedback.
- **Downloadable Report:** Export your results for easy reference.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Framer Motion, GSAP (for premium animations)
- **Backend:** Python, FastAPI, Uvicorn
- **Styling:** CSS Variables, Responsive Design

## 💻 Running Locally

### 1. Start the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🌐 Deployment

This project is configured to be easily deployed. The frontend is set up for **Netlify** with a `netlify.toml` configuration included. 

To deploy the frontend:
1. Connect this GitHub repository to Netlify.
2. Netlify will automatically detect the settings in `netlify.toml` and build the `frontend` directory.

*(Note: The FastAPI backend will need to be hosted on a service like Render, Railway, or Heroku, as Netlify is primarily for static sites and frontend frameworks).*
