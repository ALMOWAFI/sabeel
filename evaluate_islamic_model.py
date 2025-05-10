#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Islamic Language Model Evaluation Script
========================================

This script evaluates a fine-tuned language model on Islamic knowledge benchmarks.
It assesses the model's ability to:
1. Provide accurate Islamic information
2. Properly cite sources
3. Handle different schools of thought
4. Acknowledge differences of opinion
5. Avoid inappropriate content
"""

import os
import json
import argparse
import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel, PeftConfig
import numpy as np
from tqdm import tqdm
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import matplotlib.pyplot as plt
import seaborn as sns
from rouge_score import rouge_scorer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel-evaluation")

# ===============================
# Evaluation Benchmark Categories
# ===============================

BENCHMARK_CATEGORIES = [
    "quranic_knowledge",      # Knowledge of Quranic verses and tafsir
    "hadith_knowledge",       # Knowledge of hadith and their authentication
    "fiqh_rulings",           # Knowledge of Islamic jurisprudence
    "aqeedah",                # Knowledge of Islamic theology
    "contemporary_issues",    # Handling of modern issues
    "differences_of_opinion", # Acknowledging scholarly differences
    "source_citation",        # Properly citing sources
    "harmful_content",        # Avoiding inappropriate content
]

# ===============================
# Evaluation Utilities
# ===============================

def load_model_and_tokenizer(model_path: str, base_model_path: Optional[str] = None):
    """
    Loads a fine-tuned model and its tokenizer.
    
    Args:
        model_path: Path to the fine-tuned model
        base_model_path: Path to the base model if using PEFT
        
    Returns:
        Loaded model and tokenizer
    """
    # Check if this is a PEFT model
    is_peft_model = os.path.exists(os.path.join(model_path, "adapter_config.json"))
    
    if is_peft_model and base_model_path:
        logger.info(f"Loading base model from {base_model_path}")
        model = AutoModelForCausalLM.from_pretrained(
            base_model_path,
            device_map="auto",
            torch_dtype=torch.float16,
        )
        
        logger.info(f"Loading PEFT model from {model_path}")
        model = PeftModel.from_pretrained(model, model_path)
    else:
        logger.info(f"Loading model from {model_path}")
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            device_map="auto",
            torch_dtype=torch.float16,
        )
    
    # Load tokenizer (either from PEFT model path or base model path)
    tokenizer_path = model_path if not is_peft_model else base_model_path
    logger.info(f"Loading tokenizer from {tokenizer_path}")
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
    
    # Ensure pad token exists
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    return model, tokenizer

def generate_model_response(
    model,
    tokenizer,
    prompt: str,
    max_new_tokens: int = 512,
    temperature: float = 0.7,
    top_p: float = 0.9,
    num_beams: int = 1,
):
    """
    Generates a response from the model for a given prompt.
    
    Args:
        model: The model to generate from
        tokenizer: The tokenizer
        prompt: Input prompt
        max_new_tokens: Maximum number of tokens to generate
        temperature: Temperature for sampling
        top_p: Top-p sampling parameter
        num_beams: Number of beams for beam search
        
    Returns:
        Generated text
    """
    inputs = tokenizer(prompt, return_tensors="pt")
    input_ids = inputs.input_ids.to(model.device)
    
    # Generate
    with torch.no_grad():
        outputs = model.generate(
            input_ids=input_ids,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            num_beams=num_beams,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )
    
    # Get only the generated text (not the prompt)
    generated_tokens = outputs[0, input_ids.shape[1]:]
    generated_text = tokenizer.decode(generated_tokens, skip_special_tokens=True)
    
    return generated_text

# ===============================
# Evaluation Metrics
# ===============================

def calculate_factual_accuracy(
    predictions: List[str],
    references: List[str],
    key_facts: List[List[str]],
) -> float:
    """
    Calculates factual accuracy based on key facts.
    
    Args:
        predictions: Model predictions
        references: Reference answers
        key_facts: List of key facts for each example
        
    Returns:
        Factual accuracy score
    """
    scores = []
    
    for prediction, facts in zip(predictions, key_facts):
        prediction_lower = prediction.lower()
        fact_scores = []
        
        for fact in facts:
            fact_lower = fact.lower()
            if fact_lower in prediction_lower:
                fact_scores.append(1.0)
            else:
                # Check for partial matches
                terms = fact_lower.split()
                term_matches = sum(1 for term in terms if term in prediction_lower)
                fact_scores.append(term_matches / len(terms) if terms else 0)
        
        # Average fact score for this prediction
        scores.append(sum(fact_scores) / len(fact_scores) if fact_scores else 0)
    
    return sum(scores) / len(scores) if scores else 0

def calculate_citation_accuracy(
    predictions: List[str],
    expected_sources: List[List[str]],
) -> float:
    """
    Evaluates how well the model cites sources.
    
    Args:
        predictions: Model predictions
        expected_sources: Expected sources to be cited
        
    Returns:
        Citation accuracy score
    """
    scores = []
    
    for prediction, sources in zip(predictions, expected_sources):
        prediction_lower = prediction.lower()
        source_scores = []
        
        for source in sources:
            source_lower = source.lower()
            if source_lower in prediction_lower:
                source_scores.append(1.0)
            else:
                # Check for partial matches
                fragments = source_lower.split()
                fragment_matches = sum(1 for fragment in fragments if fragment in prediction_lower)
                source_scores.append(fragment_matches / len(fragments) if fragments else 0)
        
        # Average source score for this prediction
        scores.append(sum(source_scores) / len(source_scores) if source_scores else 0)
    
    return sum(scores) / len(scores) if scores else 0

def calculate_rouge_scores(predictions: List[str], references: List[str]) -> Dict[str, float]:
    """
    Calculates ROUGE scores for generated text.
    
    Args:
        predictions: Model predictions
        references: Reference answers
        
    Returns:
        Dictionary of ROUGE scores
    """
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    
    scores = {
        'rouge1': 0.0,
        'rouge2': 0.0,
        'rougeL': 0.0,
    }
    
    for pred, ref in zip(predictions, references):
        result = scorer.score(ref, pred)
        scores['rouge1'] += result['rouge1'].fmeasure
        scores['rouge2'] += result['rouge2'].fmeasure
        scores['rougeL'] += result['rougeL'].fmeasure
    
    # Average scores
    n = len(predictions)
    for k in scores:
        scores[k] /= n if n > 0 else 1
    
    return scores

def detect_inappropriate_content(
    predictions: List[str],
    inappropriate_patterns: List[str],
) -> List[bool]:
    """
    Detects inappropriate content in model responses.
    
    Args:
        predictions: Model predictions
        inappropriate_patterns: Patterns to detect
        
    Returns:
        List of boolean flags indicating inappropriate content
    """
    results = []
    
    for prediction in predictions:
        prediction_lower = prediction.lower()
        has_inappropriate = any(pattern.lower() in prediction_lower for pattern in inappropriate_patterns)
        results.append(has_inappropriate)
    
    return results

def evaluate_madhab_awareness(
    predictions: List[str],
    questions: List[str],
    expected_madhaib: List[List[str]],
) -> float:
    """
    Evaluates awareness of different schools of thought.
    
    Args:
        predictions: Model predictions
        questions: Questions that prompted the predictions
        expected_madhaib: Expected schools of thought to be mentioned
        
    Returns:
        Score for madhab awareness
    """
    scores = []
    
    for prediction, madhaib in zip(predictions, expected_madhaib):
        prediction_lower = prediction.lower()
        madhab_scores = []
        
        # Check for mentions of each madhab
        for madhab in madhaib:
            madhab_lower = madhab.lower()
            if madhab_lower in prediction_lower:
                madhab_scores.append(1.0)
            else:
                madhab_scores.append(0.0)
        
        # Average madhab score for this prediction
        scores.append(sum(madhab_scores) / len(madhab_scores) if madhab_scores else 0)
    
    return sum(scores) / len(scores) if scores else 0

# ===============================
# Benchmark Loading and Evaluation
# ===============================

def load_islamic_benchmark(benchmark_path: str) -> Dict[str, Any]:
    """
    Loads the Islamic evaluation benchmark.
    
    Args:
        benchmark_path: Path to the benchmark file
        
    Returns:
        Loaded benchmark
    """
    logger.info(f"Loading benchmark from {benchmark_path}")
    
    if not os.path.exists(benchmark_path):
        raise FileNotFoundError(f"Benchmark file not found: {benchmark_path}")
    
    with open(benchmark_path, 'r', encoding='utf-8') as f:
        benchmark = json.load(f)
    
    logger.info(f"Loaded benchmark with {sum(len(examples) for category, examples in benchmark.items())} examples")
    
    return benchmark

def format_prompt(question: str, template: str = "islamic_chat") -> str:
    """
    Formats a question into a prompt for the model.
    
    Args:
        question: The question to format
        template: The prompt template to use
        
    Returns:
        Formatted prompt
    """
    if template == "islamic_chat":
        return f"أنت مساعد إسلامي متخصص يسمى 'سبيل'. مهمتك تقديم إجابات دقيقة مستندة إلى المصادر الإسلامية الموثوقة.\n\n<user>\n{question}\n</user>\n\n<assistant>\n"
    
    elif template == "islamic_instruct":
        return f"أنت مساعد إسلامي متخصص يسمى 'سبيل'. تلتزم بتعاليم القرآن والسنة النبوية الصحيحة وأقوال العلماء المعتبرين.\n\n### السؤال:\n{question}\n\n### الإجابة:\n"
    
    else:  # Default
        return f"Question: {question}\nAnswer:"

def evaluate_model_on_benchmark(
    model,
    tokenizer,
    benchmark: Dict[str, Any],
    prompt_template: str = "islamic_chat",
    max_samples_per_category: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Evaluates the model on the Islamic benchmark.
    
    Args:
        model: The model to evaluate
        tokenizer: The tokenizer
        benchmark: The benchmark data
        prompt_template: Template for formatting prompts
        max_samples_per_category: Maximum number of samples to evaluate per category
        
    Returns:
        Evaluation results
    """
    results = {}
    all_predictions = []
    all_references = []
    all_categories = []
    all_questions = []
    all_scores = {}
    
    # Initialize scores for each metric
    for metric in ["factual_accuracy", "citation_accuracy", "rouge1", "rouge2", "rougeL", "madhab_awareness", "inappropriate_content"]:
        all_scores[metric] = []
    
    # Process each category
    for category, examples in benchmark.items():
        logger.info(f"Evaluating category: {category}")
        
        # Limit number of samples if specified
        if max_samples_per_category:
            examples = examples[:max_samples_per_category]
        
        category_predictions = []
        category_references = []
        
        for example in tqdm(examples, desc=f"Evaluating {category}"):
            question = example["question"]
            reference = example["reference_answer"]
            
            # Format prompt
            prompt = format_prompt(question, prompt_template)
            
            # Generate response
            prediction = generate_model_response(model, tokenizer, prompt)
            
            # Save results
            category_predictions.append(prediction)
            category_references.append(reference)
            all_predictions.append(prediction)
            all_references.append(reference)
            all_categories.append(category)
            all_questions.append(question)
        
        # Calculate metrics for this category
        category_results = {
            "factual_accuracy": calculate_factual_accuracy(
                category_predictions,
                category_references,
                [example.get("key_facts", []) for example in examples]
            ),
            "citation_accuracy": calculate_citation_accuracy(
                category_predictions,
                [example.get("source_citation", []) for example in examples]
            ),
        }
        
        # ROUGE scores
        rouge_scores = calculate_rouge_scores(category_predictions, category_references)
        category_results.update(rouge_scores)
        
        # Madhab awareness (for fiqh and differences_of_opinion categories)
        if category in ["fiqh_rulings", "differences_of_opinion"]:
            category_results["madhab_awareness"] = evaluate_madhab_awareness(
                category_predictions,
                [example["question"] for example in examples],
                [example.get("expected_madhaib", []) for example in examples]
            )
        else:
            category_results["madhab_awareness"] = None
        
        # Inappropriate content detection
        inappropriate = detect_inappropriate_content(
            category_predictions,
            ["إجابة خاطئة", "لا أعرف", "غير مسموح", "معلومات غير صحيحة"]  # Placeholder patterns
        )
        category_results["inappropriate_content"] = sum(inappropriate) / len(inappropriate) if inappropriate else 0
        
        # Save category results
        results[category] = {
            "metrics": category_results,
            "predictions": category_predictions,
            "references": category_references,
        }
        
        # Add to overall scores
        for metric, value in category_results.items():
            if value is not None:
                all_scores[metric].extend([value] * len(examples))
    
    # Calculate overall metrics
    overall_metrics = {
        metric: (sum(values) / len(values) if values else None)
        for metric, values in all_scores.items()
    }
    
    # Prepare detailed results
    detailed_results = {
        "overall_metrics": overall_metrics,
        "category_results": results,
        "all_data": {
            "predictions": all_predictions,
            "references": all_references,
            "categories": all_categories,
            "questions": all_questions,
        }
    }
    
    return detailed_results

# ===============================
# Results Visualization
# ===============================

def visualize_results(results: Dict[str, Any], output_dir: str):
    """
    Creates visualizations of evaluation results.
    
    Args:
        results: Evaluation results
        output_dir: Directory to save visualizations
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Create a dataframe for easier plotting
    df_metrics = []
    
    for category, category_results in results["category_results"].items():
        metrics = category_results["metrics"]
        for metric, value in metrics.items():
            if value is not None:
                df_metrics.append({
                    "category": category,
                    "metric": metric,
                    "value": value
                })
    
    df = pd.DataFrame(df_metrics)
    
    # Plot metrics by category
    plt.figure(figsize=(14, 8))
    sns.barplot(data=df, x="category", y="value", hue="metric")
    plt.title("Evaluation Metrics by Category")
    plt.ylabel("Score")
    plt.xlabel("Category")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "metrics_by_category.png"))
    
    # Plot overall metrics
    overall_metrics = results["overall_metrics"]
    metrics = []
    values = []
    
    for metric, value in overall_metrics.items():
        if value is not None:
            metrics.append(metric)
            values.append(value)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x=metrics, y=values)
    plt.title("Overall Evaluation Metrics")
    plt.ylabel("Score")
    plt.xlabel("Metric")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "overall_metrics.png"))
    
    # Save detailed results as CSV
    df.to_csv(os.path.join(output_dir, "evaluation_metrics.csv"), index=False)
    
    # Generate a summary report
    with open(os.path.join(output_dir, "evaluation_summary.txt"), 'w', encoding='utf-8') as f:
        f.write("Islamic Model Evaluation Summary\n")
        f.write("===============================\n\n")
        
        f.write("Overall Metrics:\n")
        for metric, value in overall_metrics.items():
            if value is not None:
                f.write(f"- {metric}: {value:.4f}\n")
        
        f.write("\nMetrics by Category:\n")
        for category in results["category_results"]:
            f.write(f"\n{category}:\n")
            
            for metric, value in results["category_results"][category]["metrics"].items():
                if value is not None:
                    f.write(f"- {metric}: {value:.4f}\n")

# ===============================
# Main Evaluation Script
# ===============================

def main():
    parser = argparse.ArgumentParser(description="Evaluate Islamic language model")
    
    parser.add_argument("--model-path", type=str, required=True,
                        help="Path to the fine-tuned model")
    parser.add_argument("--base-model-path", type=str, default=None,
                        help="Path to the base model (required for PEFT models)")
    parser.add_argument("--benchmark-path", type=str, required=True,
                        help="Path to the Islamic benchmark file")
    parser.add_argument("--output-dir", type=str, default="./evaluation_results",
                        help="Directory to save evaluation results")
    parser.add_argument("--prompt-template", type=str, default="islamic_chat",
                        choices=["islamic_chat", "islamic_instruct", "basic"],
                        help="Template for formatting prompts")
    parser.add_argument("--max-samples", type=int, default=None,
                        help="Maximum number of samples to evaluate per category")
    
    args = parser.parse_args()
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Load model and tokenizer
    model, tokenizer = load_model_and_tokenizer(args.model_path, args.base_model_path)
    
    # Load benchmark
    benchmark = load_islamic_benchmark(args.benchmark_path)
    
    # Evaluate model
    results = evaluate_model_on_benchmark(
        model,
        tokenizer,
        benchmark,
        prompt_template=args.prompt_template,
        max_samples_per_category=args.max_samples
    )
    
    # Save raw results
    results_file = os.path.join(args.output_dir, "evaluation_results.json")
    with open(results_file, 'w', encoding='utf-8') as f:
        # Remove predictions and references from the saved data (to keep file size manageable)
        results_to_save = {
            "overall_metrics": results["overall_metrics"],
            "category_results": {
                category: {
                    "metrics": category_data["metrics"],
                }
                for category, category_data in results["category_results"].items()
            }
        }
        json.dump(results_to_save, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Saved evaluation results to {results_file}")
    
    # Save all prediction details for analysis
    details_file = os.path.join(args.output_dir, "evaluation_details.jsonl")
    with open(details_file, 'w', encoding='utf-8') as f:
        all_data = results["all_data"]
        for i in range(len(all_data["questions"])):
            example = {
                "question": all_data["questions"][i],
                "prediction": all_data["predictions"][i],
                "reference": all_data["references"][i],
                "category": all_data["categories"][i]
            }
            f.write(json.dumps(example, ensure_ascii=False) + "\n")
    
    logger.info(f"Saved evaluation details to {details_file}")
    
    # Generate visualizations
    visualize_results(results, args.output_dir)
    logger.info(f"Generated visualizations in {args.output_dir}")
    
    # Print summary
    print("\nEvaluation Summary:")
    print("===================")
    print("\nOverall Metrics:")
    for metric, value in results["overall_metrics"].items():
        if value is not None:
            print(f"- {metric}: {value:.4f}")
    
    print("\nMetrics by Category:")
    for category in results["category_results"]:
        print(f"\n{category}:")
        for metric, value in results["category_results"][category]["metrics"].items():
            if value is not None:
                print(f"- {metric}: {value:.4f}")

if __name__ == "__main__":
    main()
