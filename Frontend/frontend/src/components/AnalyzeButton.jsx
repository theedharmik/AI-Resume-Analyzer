import './AnalyzeButton.css'

function AnalyzeButton({ loading, onClick }) {
  return (
    <button className="analyze-btn" onClick={onClick} disabled={loading}>
      {loading ? (
        <>
          <span className="analyze-btn__spinner" />
          Analyzing Resume...
        </>
      ) : (
        'Analyze Resume'
      )}
    </button>
  )
}

export default AnalyzeButton
