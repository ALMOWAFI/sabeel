#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Arabic NLP Utilities for Sabeel Islamic AI
==========================================

This module provides Arabic-specific NLP utilities for the Sabeel project:
1. Integration with the Jais-13b Arabic LLM
2. ArabertPreprocessor for Arabic text preprocessing
3. Helper functions for Islamic Arabic text processing
"""

import torch
import logging
import re
from typing import List, Dict, Any, Union, Optional
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("arabic-nlp-utils")

# Try importing transformers and arabert
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    logger.warning("Transformers library not available. Run 'pip install transformers'")
    TRANSFORMERS_AVAILABLE = False

try:
    from arabert.preprocess import ArabertPreprocessor
    ARABERT_AVAILABLE = True
except ImportError:
    logger.warning("Arabert library not available. Run 'pip install arabert'")
    ARABERT_AVAILABLE = False


class ArabicPreprocessor:
    """Arabic text preprocessing for Islamic texts."""
    
    def __init__(self, use_arabert: bool = True, arabert_model: str = "araelectra-base"):
        """
        Initialize the Arabic preprocessor.
        
        Args:
            use_arabert: Whether to use ArabertPreprocessor
            arabert_model: Which Arabert model to use for preprocessing
        """
        self.use_arabert = use_arabert and ARABERT_AVAILABLE
        
        if self.use_arabert:
            try:
                self.arabert_prep = ArabertPreprocessor(model_name=arabert_model)
                logger.info(f"Initialized ArabertPreprocessor with model: {arabert_model}")
            except Exception as e:
                logger.error(f"Error initializing ArabertPreprocessor: {e}")
                self.use_arabert = False
    
    def preprocess(self, text: str) -> str:
        """
        Preprocess Arabic text.
        
        Args:
            text: Arabic text to preprocess
            
        Returns:
            Preprocessed text
        """
        if not text:
            return text
        
        # Apply arabert preprocessing if available
        if self.use_arabert:
            try:
                text = self.arabert_prep.preprocess(text)
            except Exception as e:
                logger.warning(f"Error in ArabertPreprocessor: {e}")
        
        # Additional Islamic text preprocessing
        text = self._normalize_islamic_terms(text)
        
        return text
    
    def _normalize_islamic_terms(self, text: str) -> str:
        """
        Normalize common Islamic terms for consistency.
        
        Args:
            text: Arabic text to normalize
            
        Returns:
            Normalized text
        """
        # Normalize Allah's name with proper respect
        text = re.sub(r'الله', 'اللّٰه', text)
        
        # Normalize prophet's name
        text = re.sub(r'محمد صلى الله عليه وسلم', 'محمد ﷺ', text)
        text = re.sub(r'صلى الله عليه وسلم', 'ﷺ', text)
        
        # Normalize Quran citation format
        text = re.sub(r'سورة\s+(\w+)\s+آية\s+(\d+)', r'القرآن الكريم (\1: \2)', text)
        
        return text
    
    def extract_quran_citations(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract Quranic citations from text.
        
        Args:
            text: Arabic text containing Quranic citations
            
        Returns:
            List of dictionaries with surah and verse numbers
        """
        citations = []
        
        # Pattern 1: القرآن الكريم (البقرة: 255)
        pattern1 = r'القرآن الكريم \((\w+):\s*(\d+(?:-\d+)?)\)'
        
        # Pattern 2: سورة البقرة آية 255
        pattern2 = r'سورة\s+(\w+)\s+آية\s+(\d+(?:-\d+)?)'
        
        # Pattern 3: البقرة: 255
        pattern3 = r'(\w+):\s*(\d+(?:-\d+)?)'
        
        for pattern in [pattern1, pattern2, pattern3]:
            for match in re.finditer(pattern, text):
                surah, verse = match.groups()
                citations.append({
                    "surah": surah,
                    "verse": verse,
                    "match": match.group(0)
                })
        
        return citations
    
    def extract_hadith_citations(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract hadith citations from text.
        
        Args:
            text: Arabic text containing hadith citations
            
        Returns:
            List of dictionaries with source and hadith numbers
        """
        citations = []
        
        # Common hadith sources
        sources = [
            "صحيح البخاري",
            "صحيح مسلم",
            "سنن أبي داود",
            "سنن الترمذي",
            "سنن النسائي",
            "سنن ابن ماجه",
            "الموطأ",
            "مسند أحمد"
        ]
        
        # Pattern: صحيح البخاري (1234)
        pattern = '|'.join(sources)
        pattern = f'({pattern})\\s*(?:حديث\\s*)?(?:رقم\\s*)?\\(?\\s*(\\d+)\\s*\\)?'
        
        for match in re.finditer(pattern, text):
            source, number = match.groups()
            citations.append({
                "source": source,
                "number": number,
                "match": match.group(0)
            })
        
        return citations


class JaisArabicLLM:
    """Integration with the Jais-13b Arabic language model."""
    
    def __init__(self, model_path: str = "core42/jais-13b-chat", use_gpu: bool = True):
        """
        Initialize the Jais Arabic LLM.
        
        Args:
            model_path: Path or name of the Jais model
            use_gpu: Whether to use GPU if available
        """
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"
        
        # Prompt templates
        self.prompt_eng = """### Instruction: Your name is Sabeel, and you are an Islamic assistant developed to serve the Muslim community. You are built on the Jais foundation model but have been fine-tuned with Islamic texts from scholars like Abu Hamid Al-Ghazali, Muhammad Al-Ghazali, Sheikh Ahmad Al-Sayed, Jihad al-Turbani, and Ibrahim al-Sakran. You are designed to provide accurate and reliable information based on Islamic sources including the Quran, authentic Hadith, and scholarly interpretations. You can answer in Arabic and English. You are a helpful, respectful and honest assistant.

When answering, always provide citations to your sources. For Quranic verses, mention the Surah and verse number. For Hadith, mention the collection and hadith number. For scholarly opinions, mention the scholar and book if possible.

Always respect different Islamic interpretations and schools of thought (madhabs). When there are differences of opinion on a matter, acknowledge them respectfully.

Never invent citations or Islamic rulings. If you don't know something, admit it rather than providing incorrect information. For complex religious questions that require scholarly expertise, advise consulting with qualified scholars.

Complete the conversation below between [|Human|] and [|AI|]:
### Input: [|Human|] {Question}
### Response: [|AI|]"""

        self.prompt_ar = """### Instruction: اسمك سبيل، وأنت مساعد إسلامي تم تطويره لخدمة المجتمع المسلم. أنت مبني على نموذج جيس الأساسي ولكن تم ضبطك بنصوص إسلامية من علماء مثل أبو حامد الغزالي، محمد الغزالي، الشيخ أحمد السيد، جهاد الطرباني، وإبراهيم السكران. تم تصميمك لتقديم معلومات دقيقة وموثوقة استنادًا إلى مصادر إسلامية بما في ذلك القرآن الكريم، والحديث النبوي الصحيح، وتفسيرات العلماء. يمكنك الإجابة باللغتين العربية والإنجليزية. أنت مساعد مفيد ومحترم وصادق.

عند الإجابة، قدم دائمًا استشهادات بمصادرك. بالنسبة للآيات القرآنية، اذكر السورة ورقم الآية. بالنسبة للحديث، اذكر المجموعة ورقم الحديث. بالنسبة لآراء العلماء، اذكر العالم والكتاب إن أمكن.

احترم دائمًا التفسيرات الإسلامية المختلفة والمذاهب. عندما تكون هناك اختلافات في الرأي حول مسألة ما، اعترف بها باحترام.

لا تخترع أبدًا استشهادات أو أحكامًا إسلامية. إذا كنت لا تعرف شيئًا، اعترف بذلك بدلاً من تقديم معلومات غير صحيحة. بالنسبة للأسئلة الدينية المعقدة التي تتطلب خبرة علمية، انصح باستشارة علماء مؤهلين.

أكمل المحادثة أدناه بين [|Human|] و [|AI|]:
### Input: [|Human|] {Question}
### Response: [|AI|]"""
        
        # Load model if transformers is available
        if TRANSFORMERS_AVAILABLE:
            self._load_model()
        else:
            logger.warning("Transformers not available. Jais model will not be loaded.")
    
    def _load_model(self):
        """Load the Jais model and tokenizer."""
        try:
            logger.info(f"Loading Jais model from {self.model_path}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_path, 
                device_map="auto", 
                trust_remote_code=True
            )
            logger.info(f"Jais model loaded successfully. Using device: {self.device}")
        except Exception as e:
            logger.error(f"Error loading Jais model: {e}")
            self.model = None
            self.tokenizer = None
    
    def generate_response(self, question: str, lang: str = "ar") -> str:
        """
        Generate a response using the Jais model.
        
        Args:
            question: The user's question
            lang: Language for the prompt ("ar" or "en")
            
        Returns:
            Generated response
        """
        if not self.model or not self.tokenizer:
            return "Error: Model not loaded."
        
        try:
            # Select the appropriate prompt template
            prompt_template = self.prompt_ar if lang.lower() == "ar" else self.prompt_eng
            
            # Format the prompt
            prompt = prompt_template.format_map({'Question': question})
            
            # Generate response
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
            inputs = input_ids.to(self.device)
            input_len = inputs.shape[-1]
            
            generate_ids = self.model.generate(
                inputs,
                top_p=0.9,
                temperature=0.3,
                max_length=2048-input_len,
                min_length=input_len + 4,
                repetition_penalty=1.2,
                do_sample=True,
            )
            
            response = self.tokenizer.batch_decode(
                generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True
            )[0]
            
            # Extract just the AI response part
            response = response.split("### Response: [|AI|]")[-1].strip()
            
            return response
        
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return f"Error generating response: {str(e)}"
    
    def is_model_loaded(self) -> bool:
        """Check if the model is loaded."""
        return self.model is not None and self.tokenizer is not None


class IslamicDataAugmenter:
    """Class for augmenting Islamic training data."""
    
    def __init__(self, jais_llm: Optional[JaisArabicLLM] = None):
        """
        Initialize the Islamic data augmenter.
        
        Args:
            jais_llm: Optional JaisArabicLLM instance
        """
        self.jais_llm = jais_llm
        self.preprocessor = ArabicPreprocessor()
    
    def generate_questions(self, text: str, num_questions: int = 3) -> List[str]:
        """
        Generate questions based on an Islamic text.
        
        Args:
            text: Islamic text to generate questions from
            num_questions: Number of questions to generate
            
        Returns:
            List of generated questions
        """
        if not self.jais_llm or not self.jais_llm.is_model_loaded():
            # Fallback to rule-based generation if LLM not available
            return self._rule_based_question_generation(text, num_questions)
        
        prompt = f"""أمامك نص إسلامي، اقرأه جيداً ثم اكتب {num_questions} أسئلة مختلفة يمكن أن يطرحها شخص حول هذا النص. 
اجعل الأسئلة متنوعة ومتعمقة وذات صلة بالنص.

النص:
{text}

الأسئلة:
"""
        
        response = self.jais_llm.generate_response(prompt)
        
        # Extract questions (assumes numbered format)
        questions = []
        for line in response.split('\n'):
            # Look for numbered questions like "1. ..." or "1- ..." or just starting with a question word
            if re.match(r'^\d+[\.\-\s]', line) or re.match(r'^(ما|هل|كيف|لماذا|متى|أين|من)', line):
                # Clean up the question
                question = re.sub(r'^\d+[\.\-\s]', '', line).strip()
                if question and len(question) > 10:  # Ensure it's a substantial question
                    questions.append(question)
        
        # If we didn't extract enough questions, fall back to rule-based
        if len(questions) < num_questions:
            fallback = self._rule_based_question_generation(text, num_questions - len(questions))
            questions.extend(fallback)
        
        # Limit to requested number
        return questions[:num_questions]
    
    def _rule_based_question_generation(self, text: str, num_questions: int) -> List[str]:
        """Rule-based question generation when LLM is not available."""
        questions = []
        
        # Extract key Islamic terms
        islamic_terms = [
            "الله", "الإيمان", "الصلاة", "الزكاة", "الصوم", "الحج", 
            "الإسلام", "القرآن", "الحديث", "السنة", "الشريعة",
            "الحلال", "الحرام", "العبادة", "الأخلاق", "التوحيد"
        ]
        
        # Find which terms appear in the text
        found_terms = [term for term in islamic_terms if term in text]
        
        # Generate basic questions
        templates = [
            "ما هو مفهوم {} في الإسلام؟",
            "ما هي أهمية {} في النص المذكور؟",
            "كيف يرتبط {} بالعقيدة الإسلامية؟",
            "ما هي الآيات القرآنية المتعلقة بـ {}؟",
            "ما هي الأحكام الفقهية المتعلقة بـ {}؟"
        ]
        
        # Generate questions from templates and terms
        for term in found_terms[:num_questions]:
            template = templates[len(questions) % len(templates)]
            questions.append(template.format(term))
            if len(questions) >= num_questions:
                break
        
        # If we need more questions, add generic ones
        generic_questions = [
            "ما هي أهم النقاط المذكورة في هذا النص؟",
            "كيف يمكن تطبيق هذه المفاهيم في حياتنا اليومية؟",
            "ما هي الدروس المستفادة من هذا النص؟",
            "ما هو الحكم الشرعي المستنبط من هذا النص؟",
            "كيف يمكن فهم هذا النص في سياق العصر الحالي؟"
        ]
        
        while len(questions) < num_questions:
            questions.append(generic_questions[len(questions) % len(generic_questions)])
        
        return questions[:num_questions]
    
    def augment_with_variations(self, question: str, answer: str) -> List[Dict[str, str]]:
        """
        Create variations of a question-answer pair.
        
        Args:
            question: Original question
            answer: Original answer
            
        Returns:
            List of dictionaries with question and answer variations
        """
        variations = [{"question": question, "answer": answer}]
        
        if not self.jais_llm or not self.jais_llm.is_model_loaded():
            # Create simple variations without LLM
            if question.startswith("ما هو"):
                variations.append({
                    "question": question.replace("ما هو", "عرف"),
                    "answer": answer
                })
            elif question.startswith("كيف"):
                variations.append({
                    "question": question.replace("كيف", "ما هي طريقة"),
                    "answer": answer
                })
            return variations
        
        # Use LLM to generate variations
        prompt = f"""أمامك سؤال وإجابته. المطلوب منك توليد صيغتين مختلفتين للسؤال نفسه، مع الحفاظ على المعنى الأساسي.

السؤال الأصلي: {question}
الإجابة: {answer}

قم بكتابة صيغتين بديلتين للسؤال فقط. كل صيغة في سطر منفصل، بدون ترقيم أو علامات أخرى.
"""
        
        response = self.jais_llm.generate_response(prompt)
        
        # Extract the alternative questions (assumed to be on separate lines)
        alt_questions = [line.strip() for line in response.split('\n') if line.strip()]
        
        # Add variations with the same answer
        for alt_question in alt_questions:
            if len(alt_question) > 10 and alt_question != question:  # Ensure it's substantial and different
                variations.append({
                    "question": alt_question,
                    "answer": answer
                })
        
        return variations


# Example usage
if __name__ == "__main__":
    # Test ArabicPreprocessor
    preprocessor = ArabicPreprocessor()
    test_text = "قال الله تعالى في سورة البقرة آية 255: الله لا إله إلا هو الحي القيوم"
    processed = preprocessor.preprocess(test_text)
    print(f"Original: {test_text}")
    print(f"Processed: {processed}")
    
    # Extract Quran citations
    citations = preprocessor.extract_quran_citations(test_text)
    print(f"Quran citations: {citations}")
    
    # Test JaisArabicLLM if available
    if TRANSFORMERS_AVAILABLE:
        print("\nTesting Jais Arabic LLM...")
        jais = JaisArabicLLM()
        if jais.is_model_loaded():
            question = "ما هو حكم الصلاة في السفر؟"
            print(f"Question: {question}")
            response = jais.generate_response(question)
            print(f"Response: {response}")
        else:
            print("Jais model not loaded. Skip testing.")
    
    # Test data augmentation
    print("\nTesting Islamic data augmenter...")
    augmenter = IslamicDataAugmenter()
    sample_text = """العلم الذي هو فرض عين هو علم المعاملة، وهو علم أحوال القلب. قال الله تعالى: {يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ}"""
    questions = augmenter._rule_based_question_generation(sample_text, 3)
    print(f"Generated questions: {questions}")
