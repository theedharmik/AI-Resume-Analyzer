# AI Resume Analyzer — Frontend

A React + Vite frontend for the AI Resume Analyzer hackathon project. It uploads a PDF resume and a job description to a FastAPI backend and displays a match score, matched/missing skills, and AI suggestions.

## Tech Stack

- React 18 (JavaScript, no TypeScript)
- Vite
- Plain CSS (no UI framework)
- Native `fetch` API

## Prerequisites

- Node.js 18+ and npm installed
- The FastAPI backend running locally at `http://127.0.0.1:8000`

## Setup & Run

Open a terminal in the `frontend/` folder in VS Code, then run:

```bash
npm install
npm run dev
```

Vite will start a dev server, usually at `http://localhost:5173`. Open that URL in your browser.

Make sure your FastAPI backend is running separately (e.g. `uvicorn main:app --reload`) at `http://127.0.0.1:8000` **before** clicking "Analyze Resume" — otherwise you'll see a "can't connect to server" error.

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / Navbar.css
│   │   ├── Hero.jsx / Hero.css
│   │   ├── ResumeUpload.jsx / ResumeUpload.css
│   │   ├── JobDescription.jsx / JobDescription.css
│   │   ├── AnalyzeButton.jsx / AnalyzeButton.css
│   │   ├── ScoreCard.jsx / ScoreCard.css
│   │   ├── SkillsSection.jsx / SkillsSection.css
│   │   └── Suggestions.jsx / Suggestions.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## How the Frontend Connects to the Backend

This is the flow, end to end — useful for explaining the architecture at your hackathon demo:

1. **User interaction (`ResumeUpload.jsx`, `JobDescription.jsx`)** — The user selects a PDF resume (drag-and-drop or file picker) and pastes a job description into a textarea. Both values are held in React state inside `App.jsx`.

2. **Client-side validation (`App.jsx`)** — Before sending anything, the app checks: is there a resume file? Is it actually a PDF? Is the job description non-empty? If any check fails, a friendly inline error is shown and no request is sent.

3. **Building the request (`App.jsx`)** — A `FormData` object is created and two fields are appended: `resume` (the File object) and `job_description` (the text). `FormData` is used instead of JSON because the backend expects `multipart/form-data`, which is required to send binary file data alongside text fields in a single request.

4. **Sending the request** — The app calls:

   ```javascript
   fetch('http://127.0.0.1:8000/analyze', {
     method: 'POST',
     body: formData,
   })
   ```

   Note that `Content-Type` is never set manually. The browser automatically sets `multipart/form-data` with the correct boundary string when the body is a `FormData` instance — setting it manually would break the request.

5. **Loading state** — While waiting for the response, `loading` is set to `true`, and the "Analyze Resume" button switches to a spinner with "Analyzing Resume...".

6. **Backend processing (FastAPI, not part of this repo)** — The backend receives the PDF and job description, extracts resume text, runs its matching/scoring logic, and returns JSON in this shape:

   ```json
   {
     "filename": "resume.pdf",
     "result": {
       "score": 82,
       "matched_skills": ["python", "sql"],
       "missing_skills": ["docker", "aws"],
       "suggestions": ["Highlight relevant projects."]
     }
   }
   ```

7. **Handling the response (`App.jsx`)** — `response.json()` parses the body. If the response is not OK, or the shape is unexpected, an error is shown instead of crashing the UI. On success, the JSON is stored in state (`result`).

8. **Rendering the dashboard** — Once `result` is set, the form is swapped out for the results dashboard:
   - `ScoreCard.jsx` renders the score as an animated circular SVG progress ring.
   - `SkillsSection.jsx` (used twice) renders the matched and missing skills as tagged lists.
   - `Suggestions.jsx` renders the AI-generated suggestions as a bullet list.

9. **Error handling** — Network failures (backend not running), non-2xx HTTP statuses, and malformed JSON responses are all caught and turned into a readable message like: *"Unable to connect to the analysis server. Please make sure the backend is running."*

In short:

```text
Frontend (React state) → FormData → POST /analyze → FastAPI backend
  → JSON response → React state → Results dashboard (Score / Skills / Suggestions)
```

## Changing the Backend URL

If your backend runs on a different host/port, update the `API_URL` constant at the top of `src/App.jsx`:

```javascript
const API_URL = 'http://127.0.0.1:8000/analyze'
```

## CORS Note

Since the frontend (`localhost:5173`) and backend (`127.0.0.1:8000`) run on different ports, the FastAPI backend must have CORS enabled for the frontend origin, e.g.:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Without this, the browser will block the request even if the backend is running correctly.
