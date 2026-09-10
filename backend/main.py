from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from analyzer import analyze_resume
import io


app = FastAPI(
    title="AI Resume Analyzer API"
)


# Allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Resume Analyzer API is running"
    }


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    # Check file type
    if not resume.filename.lower().endswith(".pdf"):
        return {
            "error": "Please upload a PDF resume."
        }

    # Read uploaded PDF
    contents = await resume.read()

    pdf_file = io.BytesIO(contents)

    reader = PdfReader(pdf_file)

    resume_text = ""

    for page in reader.pages:
        text = page.extract_text()

        if text:
            resume_text += text + "\n"

    if not resume_text.strip():
        return {
            "error": "Could not extract text from the PDF."
        }

    # Analyze resume
    result = analyze_resume(
        resume_text,
        job_description
    )

    return {
        "filename": resume.filename,
        "result": result
    }