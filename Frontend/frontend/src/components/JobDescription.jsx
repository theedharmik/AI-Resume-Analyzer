import './JobDescription.css'

function JobDescription({ jobDescription, setJobDescription }) {
  return (
    <div className="jobdesc">
      <h3 className="jobdesc__label">Target Job Description</h3>
      <textarea
        className="jobdesc__textarea"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
      />
      <p className="jobdesc__hint">{jobDescription.length} characters</p>
    </div>
  )
}

export default JobDescription
