import re


# Common skills that we can look for in a resume
SKILLS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "html",
    "css",
    "sql",
    "mysql",
    "mongodb",
    "postgresql",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "power bi",
    "excel",
    "communication",
    "leadership",
]


def extract_skills(text):
    text_lower = text.lower()

    found = []

    for skill in SKILLS:
        if skill in text_lower:
            found.append(skill)

    return found


def calculate_score(resume_text, job_description):
    resume_lower = resume_text.lower()
    job_lower = job_description.lower()

    job_skills = extract_skills(job_description)
    resume_skills = extract_skills(resume_text)

    if len(job_skills) == 0:
        return 50, resume_skills, []

    matched = [
        skill for skill in job_skills
        if skill in resume_lower
    ]

    missing = [
        skill for skill in job_skills
        if skill not in resume_lower
    ]

    skill_score = (len(matched) / len(job_skills)) * 70

    keyword_score = 0

    job_words = set(re.findall(r"\b[a-zA-Z]{4,}\b", job_lower))

    resume_words = set(
        re.findall(r"\b[a-zA-Z]{4,}\b", resume_lower)
    )

    if job_words:
        keyword_score = (
            len(job_words.intersection(resume_words))
            / len(job_words)
        ) * 30

    score = round(skill_score + keyword_score)

    return score, matched, missing


def generate_suggestions(score, missing):
    suggestions = []

    if score < 50:
        suggestions.append(
            "Your resume has a low match with the target job. "
            "Consider adding more relevant skills and project experience."
        )

    elif score < 75:
        suggestions.append(
            "Your resume has a moderate match. "
            "Highlight your most relevant technical skills and projects."
        )

    else:
        suggestions.append(
            "Your resume has a strong match with the target job."
        )

    if missing:
        suggestions.append(
            "Consider adding relevant experience or projects "
            "related to: " + ", ".join(missing[:5])
        )

    suggestions.append(
        "Use measurable achievements wherever possible, "
        "such as percentages, numbers, or project impact."
    )

    return suggestions


def analyze_resume(resume_text, job_description):

    score, matched, missing = calculate_score(
        resume_text,
        job_description
    )

    suggestions = generate_suggestions(
        score,
        missing
    )

    return {
        "score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "suggestions": suggestions
    }