import './Suggestions.css'

function Suggestions({ suggestions }) {
  return (
    <div className="suggestions">
      <h4 className="suggestions__title">AI Suggestions</h4>

      {suggestions && suggestions.length > 0 ? (
        <ul className="suggestions__list">
          {suggestions.map((suggestion, idx) => (
            <li key={idx} className="suggestions__item">
              <span className="suggestions__bullet">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      ) : (
        <p className="suggestions__empty">No suggestions available.</p>
      )}
    </div>
  )
}

export default Suggestions
