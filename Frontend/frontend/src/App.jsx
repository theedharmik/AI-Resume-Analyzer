import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ResumeUpload from './components/ResumeUpload.jsx'
import JobDescription from './components/JobDescription.jsx'
import AnalyzeButton from './components/AnalyzeButton.jsx'
import ScoreCard from './components/ScoreCard.jsx'
import SkillsSection from './components/SkillsSection.jsx'
import Suggestions from './components/Suggestions.jsx'
import './App.css'

// Backend base URL. Change this if your FastAPI server runs elsewhere.
const API_URL = 'https://ai-resume-analyzer-2ud6.onrender.com/analyze'

function App() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const validateInputs = () => {
    if (!resumeFile) {
      setError('⚠️ Please upload your resume as a PDF file before analyzing.')
      return false
    }
    if (resumeFile.type !== 'application/pdf') {
      setError('⚠️ Only PDF files are supported. Please upload a .pdf resume.')
      return false
    }
    if (!jobDescription.trim()) {
      setError('⚠️ Please paste the target job description before analyzing.')
      return false
    }
    return true
  }

  const handleAnalyze = async () => {
    setError('')
    setResult(null)

    if (!validateInputs()) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('job_description', jobDescription)

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type manually — the browser sets the correct
        // multipart boundary automatically when using FormData.
      })

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      const data = await response.json()

      if (!data || !data.result) {
        throw new Error('Invalid response format from server')
      }

      setResult(data)
    } catch (err) {
      console.error('Analyze request failed:', err)
      if (err instanceof TypeError) {
        // fetch throws a TypeError on network failure (server down, CORS, etc.)
        setError(
          '⚠️ Unable to connect to the analysis server. Please make sure the backend is running at http://127.0.0.1:8000.'
        )
      } else {
        setError(`⚠️ Something went wrong while analyzing your resume. ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResumeFile(null)
    setJobDescription('')
    setResult(null)
    setError('')
  }

  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Hero />

        {!result && (
          <section className="app__form">
            <ResumeUpload resumeFile={resumeFile} setResumeFile={setResumeFile} setError={setError} />
            <JobDescription jobDescription={jobDescription} setJobDescription={setJobDescription} />

            {error && <div className="app__error">{error}</div>}

            <AnalyzeButton loading={loading} onClick={handleAnalyze} />
          </section>
        )}

        {result && (
          <section className="app__results">
            <div className="app__results-header">
              <h2>Resume Analysis</h2>
              <p className="app__filename">📄 {result.filename}</p>
            </div>

            <ScoreCard score={result.result.score} />

            <div className="app__skills-grid">
              <SkillsSection title="Matched Skills" skills={result.result.matched_skills} type="matched" />
              <SkillsSection title="Missing Skills" skills={result.result.missing_skills} type="missing" />
            </div>

            <Suggestions suggestions={result.result.suggestions} />

            <button className="app__reset-btn" onClick={handleReset}>
              ↺ Analyze Another Resume
            </button>
          </section>
        )}
      </main>

      <footer className="app__footer">
        <p>Built for a hackathon · Connects to a FastAPI backend at {API_URL}</p>
      </footer>
    </div>
  )
}

export default App
