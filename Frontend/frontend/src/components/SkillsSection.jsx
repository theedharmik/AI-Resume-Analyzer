import './SkillsSection.css'

function capitalize(word) {
  if (!word) return word
  return word
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function SkillsSection({ title, skills, type }) {
  const isMatched = type === 'matched'
  const icon = isMatched ? '✓' : '!'

  return (
    <div className={`skills skills--${type}`}>
      <h4 className="skills__title">{title}</h4>

      {skills && skills.length > 0 ? (
        <ul className="skills__list">
          {skills.map((skill, idx) => (
            <li key={idx} className="skills__item">
              <span className="skills__icon">{icon}</span>
              {capitalize(skill)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="skills__empty">
          {isMatched ? 'No matched skills found.' : 'No missing skills — great match!'}
        </p>
      )}
    </div>
  )
}

export default SkillsSection
