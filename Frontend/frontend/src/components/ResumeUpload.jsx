import { useRef, useState } from 'react'
import './ResumeUpload.css'

function ResumeUpload({ resumeFile, setResumeFile, setError }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateAndSetFile = (file) => {
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('⚠️ Only PDF files are supported. Please choose a .pdf resume.')
      setResumeFile(null)
      return
    }

    setError('')
    setResumeFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    validateAndSetFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    validateAndSetFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="upload">
      <h3 className="upload__label">Upload Your Resume</h3>

      <div
        className={`upload__dropzone ${isDragging ? 'upload__dropzone--active' : ''} ${
          resumeFile ? 'upload__dropzone--filled' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="upload__input"
        />

        {!resumeFile ? (
          <>
            <span className="upload__icon">📄</span>
            <p className="upload__text">Drop your PDF resume here</p>
            <button
              type="button"
              className="upload__btn"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              Choose PDF
            </button>
          </>
        ) : (
          <>
            <span className="upload__icon">✅</span>
            <p className="upload__filename">📄 {resumeFile.name}</p>
            <button
              type="button"
              className="upload__btn upload__btn--secondary"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              Change File
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ResumeUpload
