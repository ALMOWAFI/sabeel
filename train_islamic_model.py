#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Islamic Language Model Fine-Tuning Script
=========================================

This script performs LoRA fine-tuning on a pre-trained language model using
the Islamic dataset created by the islamic_model_pipeline.py script.

Features:
- Parameter-efficient fine-tuning using LoRA
- Support for multiple model architectures
- Arabic text handling optimizations
- Islamic content validation during training
"""

import os
import json
import logging
import argparse
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    HfArgumentParser,
    DataCollatorForLanguageModeling
)
try:
    from transformers import BitsAndBytesConfig
except ImportError:
    BitsAndBytesConfig = None # Fallback if bitsandbytes is not installed or transformers version is old

from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    TaskType
)
from datasets import load_dataset
# import bitsandbytes as bnb # bitsandbytes was commented out as it's large and causing space issues
import wandb
from sklearn.model_selection import train_test_split
import numpy as np
from tqdm import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel-training")

# ===============================
# Data Structures
# ===============================

@dataclass
class ModelArguments:
    """Arguments pertaining to which model we are fine-tuning."""
    model_name_or_path: str = "meta-llama/Llama-2-7b-hf"
    use_8bit: bool = False
    use_4bit: bool = True
    lora_rank: int = 8
    lora_alpha: int = 16
    lora_dropout: float = 0.05
    target_modules: Optional[List[str]] = None

@dataclass
class DataArguments:
    """Arguments pertaining to the data for fine-tuning."""
    data_path: str = "./sabeel_output/alpaca_data.json"
    eval_data_path: Optional[str] = None
    train_test_split: float = 0.1
    max_seq_length: int = 2048
    prompt_template: str = "islamic_instruct"

@dataclass
class TrainingArguments(TrainingArguments):
    """Training arguments."""
    output_dir: str = "./sabeel_output/fine_tuned_model"
    num_train_epochs: int = 3
    per_device_train_batch_size: int = 4
    per_device_eval_batch_size: int = 4
    gradient_accumulation_steps: int = 2
    evaluation_strategy: str = "epoch"
    save_strategy: str = "epoch"
    learning_rate: float = 2e-5
    weight_decay: float = 0.01
    warmup_ratio: float = 0.03
    lr_scheduler_type: str = "cosine"
    logging_steps: int = 10
    save_total_limit: int = 3
    group_by_length: bool = True
    report_to: List[str] = None

# ===============================
# Prompt Templates
# ===============================

PROMPT_TEMPLATES = {
    "alpaca": (
        "Below is an instruction that describes a task. "
        "Write a response that appropriately completes the request.\n\n"
        "### Instruction:\n{instruction}\n\n"
        "### Input:\n{input}\n\n"
        "### Response:\n"
    ),
    "islamic_instruct": (
        "أنت مساعد إسلامي متخصص يسمى 'سبيل'. "
        "تلتزم بتعاليم القرآن والسنة النبوية الصحيحة وأقوال العلماء المعتبرين.\n\n"
        "### السؤال:\n{instruction}\n\n"
        "### المعلومات:\n{input}\n\n"
        "### الإجابة:\n"
    ),
    "islamic_chat": (
        "أنت مساعد إسلامي متخصص يسمى 'سبيل'. "
        "مهمتك تقديم إجابات دقيقة مستندة إلى المصادر الإسلامية الموثوقة.\n\n"
        "<user>\n{instruction}\n</user>\n\n"
        "{input}\n\n"
        "<assistant>\n"
    )
}

# ===============================
# Dataset and Data Processing
# ===============================

class IslamicAlpacaDataset(Dataset):
    """Dataset for Islamic instruction fine-tuning in Alpaca format."""
    
    def __init__(
        self, 
        data_path: str, 
        tokenizer, 
        max_seq_length: int = 2048,
        prompt_template: str = "islamic_instruct",
    ):
        super(IslamicAlpacaDataset, self).__init__()
        
        self.tokenizer = tokenizer
        self.max_seq_length = max_seq_length
        self.prompt_template = PROMPT_TEMPLATES[prompt_template]
        
        logger.info(f"Loading dataset from {data_path}")
        with open(data_path, 'r', encoding='utf-8') as f:
            self.examples = json.load(f)
        
        logger.info(f"Loaded {len(self.examples)} examples from dataset")
    
    def __len__(self):
        return len(self.examples)
    
    def __getitem__(self, index):
        example = self.examples[index]
        instruction = example['instruction']
        input_text = example.get('input', '')
        output = example['output']
        
        # Format prompt according to template
        prompt = self.prompt_template.format(
            instruction=instruction,
            input=input_text
        )
        
        # Create the complete text with prompt + output
        text = prompt + output
        
        # Tokenize with padding and truncation
        encoded = self.tokenizer(
            text,
            max_length=self.max_seq_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        
        # Create labels (same as input_ids)
        input_ids = encoded["input_ids"].squeeze()
        attention_mask = encoded["attention_mask"].squeeze()
        labels = input_ids.clone()
        
        # Mask prompt tokens (we only want to train on the response)
        # Find the end of the prompt
        prompt_encoded = self.tokenizer(
            prompt, 
            max_length=self.max_seq_length, 
            truncation=True, 
            return_tensors="pt"
        )
        prompt_length = prompt_encoded["input_ids"].shape[1]
        
        # Set labels to -100 for prompt tokens (they will be ignored in loss calculation)
        labels[:prompt_length] = -100
        
        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "labels": labels
        }

def load_and_prepare_data(data_args, tokenizer):
    """Loads and prepares the Islamic dataset for training and evaluation."""
    
    # Load the dataset
    with open(data_args.data_path, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    
    # Split into train and validation
    train_data, val_data = train_test_split(
        all_data, 
        test_size=data_args.train_test_split,
        random_state=42
    )
    
    logger.info(f"Split dataset into {len(train_data)} training and {len(val_data)} validation examples")
    
    # Create datasets
    train_dataset = IslamicAlpacaDataset(
        data_path=None,  # We'll pass the data directly
        tokenizer=tokenizer,
        max_seq_length=data_args.max_seq_length,
        prompt_template=data_args.prompt_template
    )
    train_dataset.examples = train_data
    
    eval_dataset = IslamicAlpacaDataset(
        data_path=None,
        tokenizer=tokenizer,
        max_seq_length=data_args.max_seq_length,
        prompt_template=data_args.prompt_template
    )
    eval_dataset.examples = val_data
    
    return train_dataset, eval_dataset

# ===============================
# Model Setup and Training
# ===============================

def load_tokenizer_and_model(model_args):
    """Loads the tokenizer and model for fine-tuning."""
    
    logger.info(f"Loading tokenizer from {model_args.model_name_or_path}")
    tokenizer = AutoTokenizer.from_pretrained(
        model_args.model_name_or_path,
        use_fast=True
    )
    
    # Add pad token if not already defined
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Set up model loading arguments
    load_kwargs = {
        "device_map": "auto",
    }
    
    # Setup quantization if needed
    if model_args.use_8bit:
        load_kwargs["load_in_8bit"] = True
    elif model_args.use_4bit:
        if BitsAndBytesConfig:
            logger.info("Applying 4-bit quantization using BitsAndBytesConfig.")
            load_kwargs["load_in_4bit"] = True
            load_kwargs["quantization_config"] = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4"
            )
        else:
            logger.warning(
                "BitsAndBytesConfig is not available (bitsandbytes library might be missing or not fully installed). "
                "Proceeding without 4-bit quantization. Model performance may be affected or training might fail if 4-bit is strictly required."
            )
    
    logger.info(f"Loading model from {model_args.model_name_or_path}")
    model = AutoModelForCausalLM.from_pretrained(
        model_args.model_name_or_path,
        **load_kwargs
    )
    
    # Prepare model for k-bit training if using quantization
    if model_args.use_8bit or model_args.use_4bit:
        # Only call if BitsAndBytesConfig was available and used for 4-bit, or if 8-bit is selected
        if (model_args.use_4bit and BitsAndBytesConfig and 'quantization_config' in load_kwargs) or \
           model_args.use_8bit:
            model = prepare_model_for_kbit_training(model)
    
    # Set up default target modules if not specified
    default_target_modules = {
        "llama": ["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        "mistral": ["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        "mpt": ["Wqkv", "out_proj", "fc1", "fc2"],
        "falcon": ["query_key_value", "dense", "dense_h_to_4h", "dense_4h_to_h"],
    }
    
    if model_args.target_modules is None:
        # Try to find the right modules based on the model architecture
        for model_type, modules in default_target_modules.items():
            if model_type.lower() in model_args.model_name_or_path.lower():
                model_args.target_modules = modules
                break
        
        # Default to LLaMA modules if no match found
        if model_args.target_modules is None:
            model_args.target_modules = default_target_modules["llama"]
            
    logger.info(f"Using target modules: {model_args.target_modules}")
    
    # Set up LoRA configuration
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        inference_mode=False,
        r=model_args.lora_rank,
        lora_alpha=model_args.lora_alpha,
        lora_dropout=model_args.lora_dropout,
        target_modules=model_args.target_modules,
    )
    
    # Apply LoRA to model
    model = get_peft_model(model, peft_config)
    
    return tokenizer, model

def train_model(
    model_args: ModelArguments, 
    data_args: DataArguments, 
    training_args: TrainingArguments
):
    """Fine-tunes the model on the Islamic dataset."""
    
    # Initialize wandb if using it
    if training_args.report_to and "wandb" in training_args.report_to:
        wandb.init(
            project="sabeel-islamic-llm",
            name=f"islamic-ft-{model_args.model_name_or_path.split('/')[-1]}",
            config={
                **vars(model_args),
                **vars(data_args),
                **vars(training_args)
            }
        )
    
    # Load tokenizer and model
    tokenizer, model = load_tokenizer_and_model(model_args)
    
    # Prepare datasets
    train_dataset, eval_dataset = load_and_prepare_data(data_args, tokenizer)
    
    # Set up trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        tokenizer=tokenizer,
    )
    
    # Print model parameter information
    model.print_trainable_parameters()
    
    # Start training
    logger.info("Starting training")
    trainer.train()
    
    # Save the model
    logger.info(f"Saving model to {training_args.output_dir}")
    model.save_pretrained(training_args.output_dir)
    tokenizer.save_pretrained(training_args.output_dir)
    
    # Close wandb if using it
    if training_args.report_to and "wandb" in training_args.report_to:
        wandb.finish()
    
    return model, tokenizer

# ===============================
# Main Training Script
# ===============================

def main():
    """Main training script."""
    
    # Parse arguments
    parser = HfArgumentParser((ModelArguments, DataArguments, TrainingArguments))
    model_args, data_args, training_args = parser.parse_args_into_dataclasses()
    
    # Initialize wandb reporting if enabled
    if training_args.report_to is None or "wandb" not in training_args.report_to:
        training_args.report_to = ["tensorboard"]
    
    # Create output directory
    os.makedirs(training_args.output_dir, exist_ok=True)
    
    # Train the model
    model, tokenizer = train_model(model_args, data_args, training_args)
    
    logger.info("Training complete!")

if __name__ == "__main__":
    main()
