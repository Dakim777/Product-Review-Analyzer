import os
import re  # 
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from transformers import pipeline

# --- KONFIGURASI ---
GEMINI_API_KEY = "AIzaSyDKFJj-MgntmAiyYRgxrp89pte4ZajrRq0"
DATABASE_URL = "postgresql://localhost/review_db"

# --- SETUP AI ---
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash') 

print("⏳ Loading Sentiment Model (Multilingual)...")
# Reviw berdasarkan bintang (1-5)
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# --- SETUP DATABASE ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    product_text = Column(Text, nullable=False)
    sentiment_label = Column(String, nullable=False)
    sentiment_score = Column(String, nullable=False)
    key_points = Column(Text, nullable=True)

Base.metadata.create_all(bind=engine)

class ReviewCreate(BaseModel):
    text: str

class ReviewResponse(BaseModel):
    id: int
    product_text: str
    sentiment_label: str
    key_points: str
    sentiment_score: str
    class Config:
        from_attributes = True

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# --- FUNGSI PEMBERSIH TEXT (Hapus Markdown) ---
def clean_markdown(text):
    # Hapus bold (**text**)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    # Hapus bullet points (* di awal kalimat)
    text = text.replace('* ', '• ')
    return text

@app.post("/api/analyze-review", response_model=ReviewResponse)
async def analyze_review(review: ReviewCreate, db: Session = Depends(get_db)):
    try:
        # 1. ANALISIS SENTIMEN (Model Bintang)
        # Output mentah: "5 stars", "4 stars", "1 star"
        hf_result = sentiment_pipeline(review.text)[0]
        raw_label = hf_result['label'] 
        
        # Ambil angka bintangnya (misal "4 stars" -> 4)
        star_rating = int(raw_label.split()[0])
        
        # Tentukan Label (Positif/Negatif)
        if star_rating >= 4:
            final_label = "POSITIVE"
        elif star_rating == 3:
            final_label = "NEUTRAL"
        else:
            final_label = "NEGATIVE"
        
        # Tampilkan Score sebagai "X/5 Stars"
        final_score = f"{star_rating}/5 Stars"

        # 2. RINGKASAN POIN (Gemini)
        prompt = f"Buatkan 3 poin ringkasan singkat (bullet points) dalam Bahasa Indonesia dari review ini: '{review.text}'"
        ai_response = gemini_model.generate_content(prompt)
        
        # BERSIHKAN output Gemini dari simbol Markdown (** atau *)
        clean_summary = clean_markdown(ai_response.text)
        
        # 3. SIMPAN KE DATABASE
        new_review = Review(
            product_text=review.text,
            sentiment_label=final_label,
            sentiment_score=final_score, 
            key_points=clean_summary    
        )
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        
        return new_review

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reviews", response_model=list[ReviewResponse])
def get_reviews(db: Session = Depends(get_db)):
    return db.query(Review).order_by(Review.id.desc()).all()