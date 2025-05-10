#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Islamic Text Processing Pipeline for Sabeel Project
===================================================

This script provides a complete pipeline for:
1. Collecting Islamic texts from various sources
2. Preprocessing Arabic text with proper handling of diacritics and Islamic terminology
3. Generating training pairs for language model fine-tuning
4. Evaluating model outputs against Islamic guidelines
"""

import os
import re
import json
import argparse
import logging
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel")

# ===============================
# Data structures
# ===============================

@dataclass
class IslamicSource:
    """Represents an Islamic textual source with metadata."""
    title: str
    author: str
    category: str  # e.g., 'quran', 'hadith', 'fiqh'
    time_period: str  # e.g., 'classical', 'contemporary'
    content: str
    url: Optional[str] = None
    madhab: Optional[str] = None  # Islamic school of thought
    citation: Optional[str] = None
    confidence: float = 1.0  # How confident we are in the source's authenticity
    tags: List[str] = None

    def __post_init__(self):
        if self.tags is None:
            self.tags = []

@dataclass
class TrainingPair:
    """Represents a training example for fine-tuning."""
    instruction: str
    response: str
    source_id: str  # Reference to where this came from
    category: str
    context: Optional[str] = None
    requires_validation: bool = False
    
# ===============================
# Data Collection Functions
# ===============================

def scrape_shamela_library(book_id: int) -> IslamicSource:
    """
    Scrapes a book from Al-Maktaba Al-Shamela (المكتبة الشاملة).
    
    Args:
        book_id: The ID of the book in Shamela library
        
    Returns:
        An IslamicSource object with the book content
    """
    # This is a mock implementation
    logger.info(f"Scraping book ID {book_id} from Shamela")
    
    # In a real implementation, we would do:
    # - Send HTTP request to Shamela
    # - Parse HTML response
    # - Extract book content and metadata
    
    return IslamicSource(
        title=f"Book {book_id}",
        author="Unknown Scholar",
        category="fiqh",
        time_period="classical",
        content="بسم الله الرحمن الرحيم...",
        url=f"https://shamela.ws/book/{book_id}",
        madhab="shafi",
        tags=["fiqh", "aqeedah"]
    )

def fetch_quran_text() -> List[IslamicSource]:
    """Fetches the Quran text with translations and tafsir."""
    logger.info("Fetching Quran text")
    
    # In a real implementation, we would:
    # - Use an API like Quran.com or GlobalQuran
    # - Fetch surahs, verses, translations, and tafsir
    
    sources = []
    # Mock: Create one source per surah
    for surah_num in range(1, 115):
        sources.append(
            IslamicSource(
                title=f"Surah {surah_num}",
                author="Quran",
                category="quran",
                time_period="prophetic",
                content=f"Content of Surah {surah_num}...",
                tags=["quran", "surah"]
            )
        )
    
    return sources

def fetch_hadith_collections() -> List[IslamicSource]:
    """Fetches authenticated hadith collections."""
    logger.info("Fetching hadith collections")
    
    # Major hadith collections to include
    collections = [
        ("Sahih Al-Bukhari", "Imam Bukhari"),
        ("Sahih Muslim", "Imam Muslim"),
        ("Sunan Abu Dawood", "Abu Dawood"),
        ("Jami at-Tirmidhi", "Imam Tirmidhi"),
        ("Sunan an-Nasa'i", "Imam Nasa'i"),
        ("Sunan Ibn Majah", "Ibn Majah"),
    ]
    
    sources = []
    for title, author in collections:
        # In a real implementation, we would fetch the actual content
        sources.append(
            IslamicSource(
                title=title,
                author=author,
                category="hadith",
                time_period="classical",
                content="Sample hadith text...",
                tags=["hadith", "sunnah"]
            )
        )
    
    return sources

def collect_ghazali_works() -> List[IslamicSource]:
    """Collects works by Abu Hamid Al-Ghazali."""
    logger.info("Collecting works by Abu Hamid Al-Ghazali")
    
    works = [
        {"title": "إحياء علوم الدين", "tags": ["tasawwuf", "fiqh", "aqeedah"]},
        {"title": "المستصفى من علم الأصول", "tags": ["usul", "fiqh"]},
        {"title": "تهافت الفلاسفة", "tags": ["philosophy", "aqeedah"]},
        {"title": "الاقتصاد في الاعتقاد", "tags": ["aqeedah"]},
    ]
    
    sources = []
    for work in works:
        # In a real implementation, we would fetch the actual content
        sources.append(
            IslamicSource(
                title=work["title"],
                author="أبو حامد الغزالي",
                category="classical_works",
                time_period="classical",
                content="Sample text from " + work["title"],
                madhab="shafi",
                tags=work["tags"]
            )
        )
    
    return sources

def collect_contemporary_scholars() -> List[IslamicSource]:
    """Collects works by specified contemporary scholars."""
    logger.info("Collecting works by contemporary scholars")
    
    scholars = [
        {
            "name": "محمد الغزالي",
            "works": [
                {"title": "فقه السيرة", "tags": ["seerah", "fiqh"]},
                {"title": "كيف نفهم الإسلام", "tags": ["dawah", "reform"]},
            ]
        },
        {
            "name": "الشيخ أحمد السيد",
            "works": [
                {"title": "Sample work 1", "tags": ["contemporary", "fiqh"]},
            ]
        },
        {
            "name": "جهاد الترباني",
            "works": [
                {"title": "Sample work 1", "tags": ["contemporary", "dawah"]},
            ]
        },
        {
            "name": "إبراهيم السكران",
            "works": [
                {"title": "Sample work 1", "tags": ["contemporary", "aqeedah"]},
            ]
        }
    ]
    
    sources = []
    for scholar in scholars:
        for work in scholar["works"]:
            # In a real implementation, we would fetch the actual content
            sources.append(
                IslamicSource(
                    title=work["title"],
                    author=scholar["name"],
                    category="contemporary_works",
                    time_period="contemporary",
                    content="Sample text from " + work["title"],
                    tags=work["tags"]
                )
            )
    
    return sources

def collect_fatwa_qa() -> List[IslamicSource]:
    """Collects fatwa Q&A from reputable sources."""
    logger.info("Collecting fatwa Q&A pairs")
    
    # Reputable fatwa sites
    sources = [
        ("IslamQA", "https://islamqa.info/"),
        ("Dar Al-Ifta", "https://www.dar-alifta.org/"),
        ("Assembly of Muslim Jurists of America", "https://www.amjaonline.org/"),
    ]
    
    fatwa_sources = []
    for name, url in sources:
        # In a real implementation, we would scrape these sites
        fatwa_sources.append(
            IslamicSource(
                title=f"Fatwa collection from {name}",
                author=name,
                category="fatwa",
                time_period="contemporary",
                content="Sample fatwa Q&A...",
                url=url,
                tags=["fatwa", "qa"]
            )
        )
    
    return fatwa_sources

# ===============================
# Text Processing Functions
# ===============================

def preprocess_arabic_text(text: str) -> str:
    """
    Preprocesses Arabic text while preserving diacritics and Islamic terminology.
    
    Args:
        text: The raw Arabic text
        
    Returns:
        Processed text
    """
    # Remove HTML tags if present
    text = re.sub(r'<.*?>', '', text)
    
    # Normalize Unicode
    # But preserve diacritics (tashkeel)
    
    # Fix common OCR errors in Arabic texts
    
    # Handle special Islamic terms and abbreviations
    # e.g., convert "صلى الله عليه وسلم" to a standard form
    
    return text

def extract_qa_pairs(source: IslamicSource) -> List[TrainingPair]:
    """
    Extracts question-answer pairs from an Islamic source.
    
    Args:
        source: The Islamic source to process
        
    Returns:
        A list of training pairs
    """
    # This is a simplified mock implementation
    # In reality, we would use NLP techniques to identify Q&A patterns
    
    pairs = []
    # Simple detection based on question marks
    text = source.content
    qa_sections = re.split(r'(؟|[\?\n])', text)
    
    for i in range(0, len(qa_sections)-1, 2):
        if i+1 < len(qa_sections):
            question = qa_sections[i].strip()
            answer = qa_sections[i+1].strip()
            
            if question and answer and ('?' in question or '؟' in question):
                pairs.append(
                    TrainingPair(
                        instruction=question,
                        response=answer,
                        source_id=source.title,
                        category=source.category
                    )
                )
    
    return pairs

def generate_training_data(sources: List[IslamicSource]) -> List[TrainingPair]:
    """
    Generates training pairs from collected sources.
    
    Args:
        sources: List of Islamic sources
        
    Returns:
        Training pairs for fine-tuning
    """
    all_pairs = []
    
    for source in tqdm(sources, desc="Generating training data"):
        # Extract Q&A pairs directly if appropriate
        if source.category in ["fatwa", "qa"]:
            pairs = extract_qa_pairs(source)
            all_pairs.extend(pairs)
        
        # For other content, generate synthetic training examples
        else:
            # Split into chunks
            chunks = split_into_chunks(source.content, chunk_size=500)
            
            for chunk in chunks:
                # Generate questions that could be answered from this chunk
                questions = generate_questions_from_text(chunk, source.category)
                
                for question in questions:
                    all_pairs.append(
                        TrainingPair(
                            instruction=question,
                            response=chunk,  # Simplified; in reality we would generate a proper answer
                            source_id=source.title,
                            category=source.category,
                            requires_validation=True
                        )
                    )
    
    return all_pairs

def split_into_chunks(text: str, chunk_size: int) -> List[str]:
    """Splits text into chunks of approximately chunk_size characters."""
    # Split by paragraph first to avoid cutting in the middle of a paragraph
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        if len(current_chunk) + len(para) <= chunk_size:
            current_chunk += para + '\n\n'
        else:
            chunks.append(current_chunk.strip())
            current_chunk = para + '\n\n'
    
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

def generate_questions_from_text(text: str, category: str) -> List[str]:
    """
    Generates potential questions that could be asked about the text.
    
    Args:
        text: The text to generate questions from
        category: Category of the source
        
    Returns:
        List of questions
    """
    # In a real implementation, we would use a language model to generate questions
    # This is a simplified mock implementation
    
    questions = []
    
    # Basic questions based on category
    if category == "quran":
        questions.append("ما هو تفسير هذه الآية؟")
        questions.append("ما سبب نزول هذه الآية؟")
    elif category == "hadith":
        questions.append("ما صحة هذا الحديث؟")
        questions.append("ما شرح هذا الحديث؟")
    elif category == "fiqh":
        questions.append("ما حكم هذه المسألة؟")
        questions.append("ما هي الأدلة على هذا الحكم؟")
    else:
        questions.append("ما رأي العلماء في هذه المسألة؟")
        questions.append("اشرح هذا الموضوع بالتفصيل.")
    
    return questions

# ===============================
# Model Training Functions
# ===============================

def convert_to_alpaca_format(pairs: List[TrainingPair]) -> List[Dict[str, Any]]:
    """
    Converts training pairs to the Alpaca format for fine-tuning.
    
    Args:
        pairs: Training pairs
        
    Returns:
        Data in Alpaca format for fine-tuning
    """
    alpaca_data = []
    
    for pair in pairs:
        alpaca_data.append({
            "instruction": pair.instruction,
            "input": pair.context if pair.context else "",
            "output": pair.response,
            "source": pair.source_id,
            "category": pair.category
        })
    
    return alpaca_data

def prepare_model_config(model_name: str, output_dir: str) -> Dict[str, Any]:
    """
    Prepares configuration for model fine-tuning.
    
    Args:
        model_name: Base model to fine-tune
        output_dir: Directory to save the fine-tuned model
        
    Returns:
        Model configuration
    """
    return {
        "base_model": model_name,
        "output_dir": output_dir,
        "training_args": {
            "num_train_epochs": 3,
            "per_device_train_batch_size": 8,
            "gradient_accumulation_steps": 4,
            "learning_rate": 2e-5,
            "weight_decay": 0.01,
            "warmup_steps": 100,
            "fp16": True,
            "logging_steps": 10,
            "save_steps": 200,
            "save_total_limit": 3,
        }
    }

def fine_tune_model(model_config: Dict[str, Any], training_data: List[Dict[str, Any]]):
    """
    Fine-tunes a language model with the given data.
    
    Args:
        model_config: Model configuration
        training_data: Training data in Alpaca format
    """
    logger.info(f"Fine-tuning model {model_config['base_model']}")
    
    # In a real implementation, we would:
    # 1. Set up the LLaMA or similar model
    # 2. Apply LoRA or QLoRA for parameter-efficient fine-tuning
    # 3. Train on the data
    # 4. Evaluate and save the model
    
    logger.info("Model fine-tuning complete")

# ===============================
# Evaluation Functions
# ===============================

def create_islamic_benchmark(sources: List[IslamicSource]) -> Dict[str, Any]:
    """
    Creates a benchmark dataset for evaluating the model on Islamic knowledge.
    
    Args:
        sources: Islamic sources to build the benchmark from
        
    Returns:
        Benchmark dataset
    """
    benchmark = {
        "quran": [],
        "hadith": [],
        "fiqh": [],
        "aqeedah": [],
        "ethics": [],
        "contemporary": []
    }
    
    # In a real implementation, we would create a diverse set of 
    # challenging questions in each category
    
    for category in benchmark:
        # Add 50 challenging questions per category
        for i in range(50):
            benchmark[category].append({
                "question": f"Sample question {i} for {category}",
                "reference_answer": "Sample reference answer",
                "source_citation": "Citation to scholar X"
            })
    
    return benchmark

def evaluate_model(model_path: str, benchmark: Dict[str, Any]) -> Dict[str, float]:
    """
    Evaluates a fine-tuned model against the Islamic benchmark.
    
    Args:
        model_path: Path to the fine-tuned model
        benchmark: Benchmark dataset
        
    Returns:
        Evaluation metrics
    """
    logger.info(f"Evaluating model {model_path}")
    
    # In a real implementation, we would:
    # 1. Load the fine-tuned model
    # 2. Run inference on benchmark questions
    # 3. Evaluate responses against reference answers
    # 4. Calculate metrics like accuracy, faithfulness, etc.
    
    # Mock evaluation results
    metrics = {
        "quran_accuracy": 0.85,
        "hadith_accuracy": 0.82,
        "fiqh_accuracy": 0.78,
        "aqeedah_accuracy": 0.80,
        "ethics_accuracy": 0.88,
        "contemporary_accuracy": 0.75,
        "overall_accuracy": 0.81,
        "citation_accuracy": 0.76,
        "madhab_awareness": 0.82,
        "issue_handling": 0.79
    }
    
    return metrics

# ===============================
# Main Pipeline
# ===============================

def run_full_pipeline(args):
    """Runs the complete pipeline from data collection to model evaluation."""
    os.makedirs(args.output_dir, exist_ok=True)
    
    # 1. Collect data from all sources
    logger.info("Step 1: Collecting Islamic texts")
    sources = []
    
    # Collect primary texts
    sources.extend(fetch_quran_text())
    sources.extend(fetch_hadith_collections())
    
    # Collect classical works
    sources.extend(collect_ghazali_works())
    
    # Collect contemporary works
    sources.extend(collect_contemporary_scholars())
    
    # Collect Q&A and fatwas
    sources.extend(collect_fatwa_qa())
    
    # Save collected sources
    sources_file = os.path.join(args.output_dir, "islamic_sources.json")
    with open(sources_file, 'w', encoding='utf-8') as f:
        json.dump([vars(s) for s in sources], f, ensure_ascii=False, indent=2)
    
    logger.info(f"Collected {len(sources)} sources and saved to {sources_file}")
    
    # 2. Process the data and generate training pairs
    logger.info("Step 2: Processing texts and generating training pairs")
    training_pairs = generate_training_data(sources)
    
    # Save training pairs
    pairs_file = os.path.join(args.output_dir, "training_pairs.json")
    with open(pairs_file, 'w', encoding='utf-8') as f:
        json.dump([vars(p) for p in training_pairs], f, ensure_ascii=False, indent=2)
    
    logger.info(f"Generated {len(training_pairs)} training pairs and saved to {pairs_file}")
    
    # 3. Convert to model training format
    logger.info("Step 3: Converting to model training format")
    alpaca_data = convert_to_alpaca_format(training_pairs)
    
    # Save in Alpaca format
    alpaca_file = os.path.join(args.output_dir, "alpaca_data.json")
    with open(alpaca_file, 'w', encoding='utf-8') as f:
        json.dump(alpaca_data, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Converted data to Alpaca format and saved to {alpaca_file}")
    
    # 4. Prepare model configuration
    logger.info("Step 4: Preparing model configuration")
    model_dir = os.path.join(args.output_dir, "models")
    os.makedirs(model_dir, exist_ok=True)
    
    model_config = prepare_model_config(
        model_name=args.base_model, 
        output_dir=model_dir
    )
    
    # Save model configuration
    config_file = os.path.join(args.output_dir, "model_config.json")
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(model_config, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Prepared model configuration and saved to {config_file}")
    
    # 5. Fine-tune the model
    if not args.skip_training:
        logger.info("Step 5: Fine-tuning the model")
        fine_tune_model(model_config, alpaca_data)
    else:
        logger.info("Skipping model training as --skip-training flag is set")
    
    # 6. Create evaluation benchmark
    logger.info("Step 6: Creating evaluation benchmark")
    benchmark = create_islamic_benchmark(sources)
    
    # Save benchmark
    benchmark_file = os.path.join(args.output_dir, "islamic_benchmark.json")
    with open(benchmark_file, 'w', encoding='utf-8') as f:
        json.dump(benchmark, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Created evaluation benchmark and saved to {benchmark_file}")
    
    # 7. Evaluate the model
    if not args.skip_training and not args.skip_evaluation:
        logger.info("Step 7: Evaluating the model")
        model_path = os.path.join(model_dir, "final_model")
        metrics = evaluate_model(model_path, benchmark)
        
        # Save metrics
        metrics_file = os.path.join(args.output_dir, "evaluation_metrics.json")
        with open(metrics_file, 'w', encoding='utf-8') as f:
            json.dump(metrics, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Model evaluation complete. Metrics saved to {metrics_file}")
    
    logger.info("Sabeel Islamic text processing pipeline complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sabeel Islamic Text Processing Pipeline")
    
    parser.add_argument("--output-dir", type=str, default="./sabeel_output", 
                        help="Directory to save all outputs")
    parser.add_argument("--base-model", type=str, default="meta-llama/Llama-2-7b-hf", 
                        help="Base model to fine-tune")
    parser.add_argument("--skip-training", action="store_true", 
                        help="Skip model training step")
    parser.add_argument("--skip-evaluation", action="store_true", 
                        help="Skip model evaluation step")
    
    args = parser.parse_args()
    run_full_pipeline(args)
