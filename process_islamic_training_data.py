#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Islamic Training Data Processor for Sabeel
==========================================

This script processes the collected scholarly texts and creates
training data for fine-tuning the Islamic language model.

It connects:
1. The scholarly books collection
2. Islamic knowledge system
3. Training data generation for model fine-tuning
"""

import os
import json
import logging
import re
import time
import random
from pathlib import Path
from typing import List, Dict, Any, Tuple
import csv
from dataclasses import dataclass, field, asdict
import argparse

# Import from our other modules
# These imports would work when the scripts are in the same directory
try:
    from collect_scholarly_books import ScholarlyBook, ScholarsCollector
    from model_integration.islamic_knowledge_system import IslamicKnowledgeSystem
except ImportError:
    print("Note: Unable to import directly from other modules. This is expected when running the script standalone.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("islamic-data-processor")

@dataclass
class TrainingExample:
    """Class representing a training example for fine-tuning."""
    instruction: str
    input: str = ""
    output: str = ""
    category: str = "general"
    sources: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

class IslamicDataProcessor:
    """Processor for creating Islamic training data."""
    
    def __init__(self, 
                scholarly_texts_dir: str,
                output_dir: str,
                system_prompt: str = None):
        """
        Initialize the Islamic data processor.
        
        Args:
            scholarly_texts_dir: Directory containing scholarly texts
            output_dir: Directory to save processed data
            system_prompt: Optional system prompt to use for context
        """
        self.scholarly_texts_dir = Path(scholarly_texts_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize the knowledge system for assistance
        try:
            self.knowledge_system = IslamicKnowledgeSystem()
        except:
            logger.warning("Could not initialize IslamicKnowledgeSystem. Some features will be limited.")
            self.knowledge_system = None
        
        # Define the system prompt for the model
        self.system_prompt = system_prompt or """
        أنت مساعد إسلامي متخصص يسمى 'سبيل'. مهمتك تقديم إجابات دقيقة مستندة إلى:
        1. القرآن الكريم
        2. السنة النبوية الصحيحة
        3. آراء العلماء المعتبرين
        
        يجب أن تقدم إجابات:
        - دقيقة ومستندة إلى مصادر موثوقة
        - مع ذكر المصادر صراحةً (السورة والآية للقرآن، المصدر ورقم الحديث للسنة)
        - تراعي الخلافات الفقهية بموضوعية
        - تتجنب الإفتاء في المسائل المعقدة دون الإشارة إلى ضرورة الرجوع للعلماء
        """
        
        # Training categories
        self.categories = [
            "aqeedah",      # العقيدة
            "fiqh",         # الفقه
            "tafsir",       # التفسير
            "hadith",       # الحديث
            "seerah",       # السيرة
            "ethics",       # الأخلاق
            "contemporary", # قضايا معاصرة
            "spirituality", # التزكية والروحانية
            "comparative",  # مقارنة الأديان
            "general"       # عام
        ]
        
        logger.info(f"Initialized Islamic data processor with scholarly texts from {scholarly_texts_dir}")
    
    def process_all_texts(self) -> List[TrainingExample]:
        """Process all texts and create training examples."""
        all_examples = []
        
        # Process each scholar's texts
        for scholar_dir in self.scholarly_texts_dir.iterdir():
            if scholar_dir.is_dir():
                scholar_name = scholar_dir.name.replace('_', ' ')
                logger.info(f"Processing texts for scholar: {scholar_name}")
                
                # Process each book
                for file_path in scholar_dir.iterdir():
                    if file_path.suffix == '.txt' and not file_path.name.endswith('_metadata.txt'):
                        try:
                            # Process the book
                            book_examples = self.process_book(file_path, scholar_name)
                            all_examples.extend(book_examples)
                            
                            logger.info(f"Generated {len(book_examples)} examples from {file_path.name}")
                        except Exception as e:
                            logger.error(f"Error processing {file_path}: {e}")
        
        logger.info(f"Generated {len(all_examples)} training examples in total")
        return all_examples
    
    def process_book(self, book_path: Path, scholar_name: str) -> List[TrainingExample]:
        """
        Process a single book and create training examples.
        
        Args:
            book_path: Path to the book file
            scholar_name: Name of the scholar
            
        Returns:
            List of training examples
        """
        # Load the book content
        with open(book_path, 'r', encoding='utf-8') as f:
            book_content = f.read()
        
        # Load metadata if available
        metadata_path = book_path.parent / (book_path.stem + "_metadata.json")
        book_metadata = {}
        category = "general"
        
        if metadata_path.exists():
            try:
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    book_metadata = json.load(f)
                    category = book_metadata.get("category", "general")
            except Exception as e:
                logger.warning(f"Error loading metadata for {book_path}: {e}")
        
        book_title = book_metadata.get("title", book_path.stem.replace('_', ' '))
        
        # Create training examples
        examples = []
        
        # Add examples from different generation techniques
        examples.extend(self._generate_qa_pairs(book_content, book_title, scholar_name, category))
        examples.extend(self._generate_concept_explanations(book_content, book_title, scholar_name, category))
        examples.extend(self._generate_comparative_examples(book_content, book_title, scholar_name, category))
        
        return examples
    
    def _generate_qa_pairs(self, content: str, title: str, scholar: str, category: str) -> List[TrainingExample]:
        """Generate question-answer pairs from text content."""
        examples = []
        
        # Break content into paragraphs
        paragraphs = [p for p in content.split('\n\n') if len(p.strip()) > 100]
        
        # Select a subset of paragraphs to process
        selected_paragraphs = random.sample(paragraphs, min(10, len(paragraphs)))
        
        for paragraph in selected_paragraphs:
            # Simple question generation based on paragraph content
            # In a real implementation, this would use more sophisticated techniques
            words = paragraph.split()
            if len(words) < 15:
                continue
                
            # Extract keywords that could form the basis of questions
            common_islamic_terms = [
                "الله", "الإيمان", "الصلاة", "الزكاة", "الصوم", "الحج", 
                "الإسلام", "القرآن", "الحديث", "السنة", "الشريعة",
                "الحلال", "الحرام", "العبادة", "الأخلاق", "التوحيد"
            ]
            
            paragraph_terms = [word for word in words if any(term in word for term in common_islamic_terms)]
            
            if not paragraph_terms:
                continue
            
            # Generate a question
            selected_term = random.choice(paragraph_terms)
            
            # Simple templates for questions
            question_templates = [
                f"ما هو مفهوم {selected_term} في الإسلام؟",
                f"كيف شرح {scholar} مفهوم {selected_term}؟",
                f"ما هي أهمية {selected_term} في كتاب {title}؟",
                f"ما رأي {scholar} في {selected_term}؟"
            ]
            
            question = random.choice(question_templates)
            
            # Create the training example
            example = TrainingExample(
                instruction=question,
                output=paragraph,
                category=category,
                sources=[f"{scholar}: {title}"],
                metadata={
                    "scholar": scholar,
                    "book": title,
                    "term": selected_term
                }
            )
            
            examples.append(example)
        
        return examples
    
    def _generate_concept_explanations(self, content: str, title: str, scholar: str, category: str) -> List[TrainingExample]:
        """Generate concept explanation examples."""
        examples = []
        
        # Islamic concepts to look for
        islamic_concepts = [
            "التوحيد", "الإيمان", "الإحسان", "العبادة", "الأخلاق",
            "الصلاة", "الزكاة", "الصوم", "الحج", "الجهاد",
            "الحلال", "الحرام", "المباح", "المكروه", "المندوب"
        ]
        
        # Find paragraphs that mention these concepts
        for concept in islamic_concepts:
            if concept in content:
                # Find a paragraph containing this concept
                paragraphs = content.split('\n\n')
                relevant_paragraphs = [p for p in paragraphs if concept in p and len(p.strip()) > 100]
                
                if relevant_paragraphs:
                    paragraph = random.choice(relevant_paragraphs)
                    
                    # Create instruction templates
                    instruction_templates = [
                        f"اشرح مفهوم {concept} في الإسلام",
                        f"ما هو {concept} وما أهميته في الإسلام؟",
                        f"كيف يشرح {scholar} مفهوم {concept}؟"
                    ]
                    
                    instruction = random.choice(instruction_templates)
                    
                    # Create the training example
                    example = TrainingExample(
                        instruction=instruction,
                        output=paragraph,
                        category=category,
                        sources=[f"{scholar}: {title}"],
                        metadata={
                            "scholar": scholar,
                            "book": title,
                            "concept": concept
                        }
                    )
                    
                    examples.append(example)
        
        return examples
    
    def _generate_comparative_examples(self, content: str, title: str, scholar: str, category: str) -> List[TrainingExample]:
        """Generate examples comparing different perspectives."""
        examples = []
        
        # Only generate these for certain categories
        if category not in ["fiqh", "aqeedah", "comparative", "contemporary"]:
            return examples
        
        # Islamic schools of thought (madhabs)
        madhabs = ["الحنفي", "المالكي", "الشافعي", "الحنبلي"]
        
        # Check if any madhabs are mentioned
        mentioned_madhabs = [m for m in madhabs if m in content]
        
        if len(mentioned_madhabs) >= 2:
            # Find paragraphs that mention multiple madhabs
            paragraphs = content.split('\n\n')
            relevant_paragraphs = [
                p for p in paragraphs 
                if sum(1 for m in mentioned_madhabs if m in p) >= 2 
                and len(p.strip()) > 150
            ]
            
            if relevant_paragraphs:
                paragraph = random.choice(relevant_paragraphs)
                
                # Create comparative instruction
                madhab1, madhab2 = random.sample(mentioned_madhabs, 2)
                
                instruction_templates = [
                    f"قارن بين المذهب {madhab1} والمذهب {madhab2} في هذه المسألة",
                    f"ما الفرق بين رأي المذهب {madhab1} والمذهب {madhab2}؟",
                    f"كيف يشرح {scholar} اختلاف المذاهب في هذه المسألة؟"
                ]
                
                instruction = random.choice(instruction_templates)
                
                # Create the training example
                example = TrainingExample(
                    instruction=instruction,
                    output=paragraph,
                    category="comparative",
                    sources=[f"{scholar}: {title}"],
                    metadata={
                        "scholar": scholar,
                        "book": title,
                        "madhabs": [madhab1, madhab2]
                    }
                )
                
                examples.append(example)
        
        return examples
    
    def save_training_data(self, examples: List[TrainingExample], formats: List[str] = ["jsonl", "csv"]) -> Dict[str, str]:
        """
        Save training examples in multiple formats.
        
        Args:
            examples: List of training examples
            formats: List of output formats (jsonl, csv, etc.)
            
        Returns:
            Dictionary mapping format to output file path
        """
        output_files = {}
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        
        # Save in JSONL format (for most model training)
        if "jsonl" in formats:
            jsonl_path = self.output_dir / f"islamic_training_data_{timestamp}.jsonl"
            with open(jsonl_path, 'w', encoding='utf-8') as f:
                for example in examples:
                    # Convert to the format expected by model training
                    training_item = {
                        "instruction": example.instruction,
                        "input": example.input,
                        "output": example.output,
                        "metadata": {
                            "category": example.category,
                            "sources": example.sources,
                            **example.metadata
                        }
                    }
                    f.write(json.dumps(training_item, ensure_ascii=False) + "\n")
            
            output_files["jsonl"] = str(jsonl_path)
            logger.info(f"Saved {len(examples)} examples in JSONL format: {jsonl_path}")
        
        # Save in CSV format (for easy inspection)
        if "csv" in formats:
            csv_path = self.output_dir / f"islamic_training_data_{timestamp}.csv"
            with open(csv_path, 'w', encoding='utf-8', newline='') as f:
                fieldnames = ["instruction", "input", "output", "category", "sources"]
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                
                for example in examples:
                    writer.writerow({
                        "instruction": example.instruction,
                        "input": example.input,
                        "output": example.output,
                        "category": example.category,
                        "sources": ", ".join(example.sources)
                    })
            
            output_files["csv"] = str(csv_path)
            logger.info(f"Saved {len(examples)} examples in CSV format: {csv_path}")
        
        return output_files
    
    def generate_statistics(self, examples: List[TrainingExample]) -> Dict[str, Any]:
        """
        Generate statistics about the training data.
        
        Args:
            examples: List of training examples
            
        Returns:
            Dictionary of statistics
        """
        stats = {
            "total_examples": len(examples),
            "by_category": {},
            "avg_instruction_length": 0,
            "avg_output_length": 0,
            "source_distribution": {}
        }
        
        # Count examples by category
        for example in examples:
            # By category
            if example.category in stats["by_category"]:
                stats["by_category"][example.category] += 1
            else:
                stats["by_category"][example.category] = 1
            
            # Length statistics
            stats["avg_instruction_length"] += len(example.instruction)
            stats["avg_output_length"] += len(example.output)
            
            # Source distribution
            for source in example.sources:
                scholar = source.split(':')[0].strip()
                if scholar in stats["source_distribution"]:
                    stats["source_distribution"][scholar] += 1
                else:
                    stats["source_distribution"][scholar] = 1
        
        # Calculate averages
        if examples:
            stats["avg_instruction_length"] /= len(examples)
            stats["avg_output_length"] /= len(examples)
        
        return stats
    
    def save_statistics(self, stats: Dict[str, Any]) -> str:
        """
        Save statistics to a file.
        
        Args:
            stats: Dictionary of statistics
            
        Returns:
            Path to the statistics file
        """
        stats_path = self.output_dir / "training_data_statistics.json"
        
        with open(stats_path, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved statistics to: {stats_path}")
        return str(stats_path)
    
    def create_training_splits(self, examples: List[TrainingExample],
                              train_ratio: float = 0.8,
                              dev_ratio: float = 0.1,
                              test_ratio: float = 0.1) -> Dict[str, List[TrainingExample]]:
        """
        Create train/validation/test splits of the data.
        
        Args:
            examples: List of training examples
            train_ratio: Proportion for training set
            dev_ratio: Proportion for validation set
            test_ratio: Proportion for test set
            
        Returns:
            Dictionary with 'train', 'dev', and 'test' splits
        """
        # Shuffle the examples
        shuffled = examples.copy()
        random.shuffle(shuffled)
        
        # Calculate split sizes
        total = len(shuffled)
        train_size = int(total * train_ratio)
        dev_size = int(total * dev_ratio)
        
        # Create splits
        splits = {
            "train": shuffled[:train_size],
            "dev": shuffled[train_size:train_size+dev_size],
            "test": shuffled[train_size+dev_size:]
        }
        
        # Save each split
        for split_name, split_examples in splits.items():
            # Save as JSONL
            split_path = self.output_dir / f"{split_name}_data.jsonl"
            with open(split_path, 'w', encoding='utf-8') as f:
                for example in split_examples:
                    training_item = {
                        "instruction": example.instruction,
                        "input": example.input,
                        "output": example.output,
                        "metadata": {
                            "category": example.category,
                            "sources": example.sources,
                            **example.metadata
                        }
                    }
                    f.write(json.dumps(training_item, ensure_ascii=False) + "\n")
            
            logger.info(f"Saved {len(split_examples)} examples in {split_name} split: {split_path}")
        
        return splits

def main():
    """Main function for processing Islamic training data."""
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Process Islamic texts for training data")
    parser.add_argument("--input-dir", type=str, 
                       default=os.path.join("data", "scholarly_texts"),
                       help="Directory containing scholarly texts")
    parser.add_argument("--output-dir", type=str, 
                       default=os.path.join("data", "processed"),
                       help="Directory to save processed data")
    parser.add_argument("--formats", type=str, default="jsonl,csv",
                       help="Output formats (comma-separated)")
    
    args = parser.parse_args()
    
    # Construct absolute paths
    base_dir = os.path.join(
        "c:", os.sep, "Users", "Aliel", "OneDrive - Constructor University", 
        "Desktop", "sabeel", "sabeel-tech-awakening"
    )
    
    input_dir = os.path.join(base_dir, args.input_dir)
    output_dir = os.path.join(base_dir, args.output_dir)
    
    # Create the processor
    processor = IslamicDataProcessor(
        scholarly_texts_dir=input_dir,
        output_dir=output_dir
    )
    
    # Process all texts
    examples = processor.process_all_texts()
    
    # Save the training data
    formats = args.formats.split(',')
    output_files = processor.save_training_data(examples, formats=formats)
    
    # Generate and save statistics
    stats = processor.generate_statistics(examples)
    stats_path = processor.save_statistics(stats)
    
    # Create train/dev/test splits
    splits = processor.create_training_splits(examples)
    
    # Print summary
    print("\nTraining Data Generation Summary:")
    print(f"Total examples generated: {len(examples)}")
    print("\nCategory distribution:")
    for category, count in stats["by_category"].items():
        print(f"  - {category}: {count} examples ({count/len(examples)*100:.1f}%)")
    
    print("\nAverage lengths:")
    print(f"  - Instruction: {stats['avg_instruction_length']:.1f} characters")
    print(f"  - Output: {stats['avg_output_length']:.1f} characters")
    
    print("\nOutput files:")
    for fmt, path in output_files.items():
        print(f"  - {fmt.upper()}: {path}")
    
    print(f"  - Statistics: {stats_path}")

if __name__ == "__main__":
    main()
