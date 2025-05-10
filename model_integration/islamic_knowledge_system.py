#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Islamic Knowledge System
=======================

This module provides a comprehensive system for processing and analyzing
Islamic texts and queries. It integrates with language models to provide
accurate responses on Islamic topics while ensuring:

1. Source attribution (Quran, Hadith, scholarly works)
2. Appropriate handling of different madhabs (schools of thought)
3. Respect for Islamic sensitivities and ethics

Adapted from the enhanced_math_system.py in hack2
"""

import os
import json
import logging
import re
import time
from typing import List, Dict, Any, Tuple, Optional, Union
import requests
from dotenv import load_dotenv
import openai

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("islamic-knowledge-system")

# Load environment variables
load_dotenv()

class IslamicKnowledgeSystem:
    """
    A system for analyzing and responding to Islamic knowledge queries
    with accurate information and proper source attribution.
    """
    
    def __init__(self, config_path=None):
        """
        Initialize the Islamic Knowledge System.
        
        Args:
            config_path: Path to configuration file. If None, uses environment variables.
        """
        self.config = self._load_config(config_path)
        self._setup_openai()
        self.sources_db = self._initialize_sources_db()
        
        # Define primary sources
        self.primary_sources = {
            "quran": "القرآن الكريم",
            "hadith": {
                "bukhari": "صحيح البخاري",
                "muslim": "صحيح مسلم",
                "abu_dawood": "سنن أبي داود",
                "tirmidhi": "سنن الترمذي",
                "nasai": "سنن النسائي",
                "ibn_majah": "سنن ابن ماجه"
            }
        }
        
        # Define madhabs (schools of thought)
        self.madhabs = {
            "hanafi": "الحنفي",
            "maliki": "المالكي",
            "shafii": "الشافعي",
            "hanbali": "الحنبلي"
        }
        
        # Scholars to prioritize
        self.priority_scholars = [
            "Abu Hamid Al-Ghazali",
            "Muhammad Al-Ghazali",
            "Sheikh Ahmad Al-Sayed",
            "Jihad al-Turbani",
            "Ibrahim al-Sakran"
        ]
        
        logger.info("Islamic Knowledge System initialized")
    
    def _load_config(self, config_path):
        """Load configuration from file or environment variables."""
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Default configuration from environment variables
        return {
            "api_type": os.getenv("OPENAI_API_TYPE", "azure"),
            "api_base": os.getenv("OPENAI_API_BASE"),
            "api_version": os.getenv("OPENAI_API_VERSION", "2023-05-15"),
            "api_key": os.getenv("OPENAI_API_KEY"),
            "deployment_name": os.getenv("OPENAI_DEPLOYMENT_NAME", "islamic-knowledge-gpt-4"),
            "model_name": os.getenv("OPENAI_MODEL_NAME", "gpt-4"),
            "system_message": os.getenv("SYSTEM_MESSAGE", 
                "أنت مساعد إسلامي متخصص يسمى 'سبيل'. "
                "مهمتك تقديم إجابات دقيقة مستندة إلى المصادر الإسلامية الموثوقة "
                "مثل القرآن الكريم والسنة النبوية وآراء العلماء المعتبرين."
            )
        }
    
    def _setup_openai(self):
        """Configure the OpenAI client based on configuration."""
        openai.api_type = self.config.get("api_type", "azure")
        openai.api_key = self.config.get("api_key")
        openai.api_base = self.config.get("api_base")
        openai.api_version = self.config.get("api_version", "2023-05-15")
        
        if not openai.api_key:
            logger.warning("OpenAI API key not set. Some functionality will be limited.")
    
    def _initialize_sources_db(self):
        """Initialize the database of Islamic sources."""
        # In a real implementation, this would load from a database
        # Here we use a simplified in-memory structure
        sources = {
            "quran": {},  # Will be populated with chapter:verse -> text
            "hadith": {},  # Will be populated with collection:number -> text
            "scholars": {}  # Will be populated with scholar:book:page -> text
        }
        
        # Example of loading Quran data
        # In production, this would come from an actual database
        try:
            # Load a few sample verses for demonstration
            sources["quran"]["2:255"] = "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ"
            sources["quran"]["112:1-4"] = "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾"
            
            # Example hadith
            sources["hadith"]["bukhari:1"] = "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى"
            
            # Example scholarly text from Al-Ghazali
            sources["scholars"]["Abu Hamid Al-Ghazali:إحياء علوم الدين:1"] = "العلم الذي هو فرض عين هو علم المعاملة، وهو علم أحوال القلب..."
            
            logger.info("Initialized sources database with sample data")
        except Exception as e:
            logger.error(f"Error initializing sources database: {e}")
        
        return sources
    
    def process_query(self, query: str, madhab: str = None, context: List[Dict] = None, user_id: Optional[str] = None) -> Dict:
        """
        Process an Islamic knowledge query and return a response with sources.
        
        Args:
            query: The user's query about Islamic knowledge
            madhab: Optional specific madhab (school of thought) to prioritize
            context: Optional conversation context
            user_id: Optional user identifier for personalization
            
        Returns:
            Dictionary containing the response, sources, and related information
        """
        start_time = time.time()
        logger.info(f"Processing query: {query}")
        
        # Prepare the prompt with appropriate context
        prompt = self._prepare_islamic_prompt(query, madhab, context)
        
        # Get response from the model
        response = self._get_model_response(prompt)
        
        # Extract and validate sources
        processed_response = self._process_and_validate_response(response)
        
        # Add personalized suggestions if user_id is available
        if user_id:
            suggestions = self.get_personalized_suggestions(user_id, query, context or [])
            processed_response["personalized_suggestions"] = suggestions
        else:
            processed_response["personalized_suggestions"] = []

        elapsed_time = time.time() - start_time
        logger.info(f"Query processed in {elapsed_time:.2f} seconds")
        
        return processed_response
    
    def _prepare_islamic_prompt(self, query: str, madhab: str = None, context: List[Dict] = None) -> List[Dict]:
        """
        Prepare a prompt with Islamic knowledge context.
        
        Args:
            query: The user's query
            madhab: Optional madhab to prioritize
            context: Optional conversation context
            
        Returns:
            Formatted prompt for the model
        """
        messages = [
            {"role": "system", "content": self.config.get("system_message")}
        ]
        
        # Add specific guidance based on madhab if provided
        if madhab and madhab in self.madhabs:
            madhab_guidance = (
                f"المستخدم يتبع المذهب {self.madhabs[madhab]}. "
                f"يرجى إعطاء الأولوية لآراء هذا المذهب في الإجابة، "
                f"مع ذكر الآراء الأخرى إذا كانت مهمة للسياق."
            )
            messages[0]["content"] += f"\n\n{madhab_guidance}"
        
        # Add context if available
        if context:
            for msg in context:
                # Ensure context messages have 'role' and 'content'
                if "role" in msg and "content" in msg:
                    messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add the current user query
        messages.append({"role": "user", "content": query})
        
        # Add guidance for priority scholars
        priority_scholars_guidance = (
            f"Please give special consideration to the works and opinions of the following scholars if relevant: "
            f"{', '.join(self.priority_scholars)}. However, always prioritize primary sources (Quran and Sunnah)."
        )
        messages[0]["content"] += f"\n\n{priority_scholars_guidance}"

        logger.debug(f"Prepared prompt: {json.dumps(messages, ensure_ascii=False, indent=2)}")
        return messages
    
    def _get_model_response(self, prompt: List[Dict]) -> str:
        """
        Get a response from the language model.
        
        Args:
            prompt: Formatted prompt for the model
            
        Returns:
            Model's response text
        """
        try:
            if self.config.get("api_type") == "azure":
                response = openai.ChatCompletion.create(
                    deployment_id=self.config.get("deployment_name"),
                    messages=prompt,
                    temperature=0.3,  # Lower temperature for more factual responses
                    max_tokens=2000,
                    top_p=0.95,
                    frequency_penalty=0,
                    presence_penalty=0,
                    stop=None
                )
            else:
                # For OpenAI API
                response = openai.ChatCompletion.create(
                    model=self.config.get("model_name", "gpt-4"),
                    messages=prompt,
                    temperature=0.3,
                    max_tokens=2000,
                    top_p=0.95,
                    frequency_penalty=0,
                    presence_penalty=0,
                    stop=None
                )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Error getting model response: {e}")
            return "حدث خطأ في معالجة الاستعلام. يرجى المحاولة مرة أخرى."
    
    def _process_and_validate_response(self, response: str) -> Dict:
        """
        Process, validate, and enhance the model's response.
        
        Args:
            response: The raw model response
            
        Returns:
            Processed response with validated sources and additional info
        """
        # Extract sources from the response
        sources = self._extract_sources(response)
        
        # Validate the extracted sources
        validated_sources = self._validate_sources(sources)
        
        # Check for inappropriate content
        is_appropriate = self._check_appropriateness(response)
        
        # Format the response with enhanced source formatting
        formatted_response = self._format_response(response)
        
        return {
            "response": formatted_response,
            "sources": validated_sources,
            "is_appropriate": is_appropriate,
            "scholarly_analysis": self._extract_scholarly_context(response)
        }
    
    def _extract_sources(self, response: str) -> Dict:
        """
        Extract sources cited in the response.
        
        Args:
            response: The model's response
            
        Returns:
            Dictionary of extracted sources by type
        """
        sources = {
            "quran": [],
            "hadith": [],
            "scholars": []
        }
        
        # Extract Quranic citations (e.g., "Quran 2:255" or "سورة البقرة آية 255")
        quran_patterns = [
            r'(?:Quran|القرآن|قرآن)\s+(\d+):(\d+(?:-\d+)?)',
            r'سورة\s+\w+\s+آية\s+(\d+(?:-\d+)?)'
        ]
        
        for pattern in quran_patterns:
            matches = re.finditer(pattern, response, re.IGNORECASE)
            for match in matches:
                if len(match.groups()) >= 1:
                    surah = match.group(1) if len(match.groups()) >= 2 else "?"
                    verse = match.group(2) if len(match.groups()) >= 2 else match.group(1)
                    sources["quran"].append(f"{surah}:{verse}")
        
        # Extract Hadith citations
        hadith_collections = "|".join(self.primary_sources["hadith"].values())
        hadith_pattern = fr'(?:{hadith_collections})\s+(?:حديث\s+)?(?:رقم\s+)?(\d+)'
        
        for match in re.finditer(hadith_pattern, response, re.IGNORECASE):
            collection = next((k for k, v in self.primary_sources["hadith"].items() 
                              if v in match.group(0)), "unknown")
            number = match.group(1)
            sources["hadith"].append(f"{collection}:{number}")
        
        # Extract scholar citations
        scholar_pattern = r'(?:' + '|'.join(self.priority_scholars) + r')\s+في\s+(?:كتاب|كتابه)?\s+([^،.]+)'
        for match in re.finditer(scholar_pattern, response, re.IGNORECASE):
            scholar = next((s for s in self.priority_scholars if s in match.group(0)), "unknown")
            book = match.group(1).strip()
            sources["scholars"].append(f"{scholar}:{book}")
        
        return sources
    
    def _validate_sources(self, sources: Dict) -> Dict:
        """
        Validate extracted sources against the sources database.
        
        Args:
            sources: Dictionary of extracted sources
            
        Returns:
            Dictionary of validated sources with additional metadata
        """
        validated = {
            "quran": [],
            "hadith": [],
            "scholars": [],
            "invalid": []
        }
        
        # Validate Quranic citations
        for citation in sources["quran"]:
            if citation in self.sources_db["quran"]:
                validated["quran"].append({
                    "citation": citation,
                    "text": self.sources_db["quran"][citation],
                    "valid": True
                })
            else:
                # In a real implementation, this would check an actual Quran database
                # Here we assume citations not in our sample data are potentially valid
                validated["quran"].append({
                    "citation": citation,
                    "text": "النص غير متوفر في قاعدة البيانات المحلية",
                    "valid": "unknown"
                })
        
        # Validate Hadith citations
        for citation in sources["hadith"]:
            if citation in self.sources_db["hadith"]:
                validated["hadith"].append({
                    "citation": citation,
                    "text": self.sources_db["hadith"][citation],
                    "valid": True
                })
            else:
                validated["hadith"].append({
                    "citation": citation,
                    "text": "النص غير متوفر في قاعدة البيانات المحلية",
                    "valid": "unknown"
                })
        
        # Validate scholar citations
        for citation in sources["scholars"]:
            parts = citation.split(":")
            if len(parts) >= 2:
                scholar, book = parts[0], parts[1]
                key = f"{scholar}:{book}:1"  # Simplified key for demonstration
                
                if key in self.sources_db["scholars"]:
                    validated["scholars"].append({
                        "citation": citation,
                        "text": self.sources_db["scholars"][key],
                        "valid": True
                    })
                else:
                    validated["scholars"].append({
                        "citation": citation,
                        "text": "النص غير متوفر في قاعدة البيانات المحلية",
                        "valid": "unknown"
                    })
            else:
                validated["invalid"].append(citation)
        
        return validated
    
    def _check_appropriateness(self, response: str) -> bool:
        """
        Check if the response contains appropriate Islamic content.
        
        Args:
            response: The model's response
            
        Returns:
            Boolean indicating if the response is appropriate
        """
        # In a real implementation, this would use a more sophisticated approach
        # For now, we use a simple keyword check for demonstration
        inappropriate_terms = [
            "موسيقى", "غناء", "رقص", "أغاني",  # Potentially sensitive topics
            "haram music", "dancing",  # English equivalents
            "آلات موسيقية", "أفلام إباحية"  # Other sensitive terms
        ]
        
        return not any(term in response.lower() for term in inappropriate_terms)
    
    def _format_response(self, response: str) -> str:
        """
        Format the response for better readability and source highlighting.
        
        Args:
            response: The model's response
            
        Returns:
            Formatted response
        """
        # In a real implementation, this would add formatting to highlight sources
        # For simplicity, we return the original response here
        return response
    
    def _extract_scholarly_context(self, response: str) -> Dict:
        """
        Extract scholarly analysis and context from the response.
        
        Args:
            response: The model's response
            
        Returns:
            Dictionary with scholarly context
        """
        # In a real implementation, this would analyze the scholarly content
        # For now, return a simple structure
        return {
            "scholars_mentioned": [s for s in self.priority_scholars if s in response],
            "has_multiple_opinions": any(f"({m})" in response for m in self.madhabs.values()),
            "scholarly_depth": "medium"  # Would be determined by analysis
        }
    
    def get_scholarly_works(self, scholar: str = None, topic: str = None) -> List[Dict]:
        """
        Get scholarly works relevant to a scholar or topic.
        
        Args:
            scholar: Optional scholar name to filter by
            topic: Optional topic to search for
            
        Returns:
            List of matching scholarly works
        """
        # In a real implementation, this would query a database
        # For demonstration, we return sample data
        works = [
            {
                "author": "Abu Hamid Al-Ghazali",
                "title": "إحياء علوم الدين",
                "topics": ["أخلاق", "تزكية", "فقه", "تصوف"],
                "time_period": "classical"
            },
            {
                "author": "Muhammad Al-Ghazali",
                "title": "فقه السيرة",
                "topics": ["سيرة", "فقه"],
                "time_period": "contemporary"
            },
            {
                "author": "Ibrahim al-Sakran",
                "title": "التنوير الزائف",
                "topics": ["فكر", "فلسفة"],
                "time_period": "contemporary"
            }
        ]
        
        # Filter by scholar if provided
        if scholar:
            works = [w for w in works if scholar.lower() in w["author"].lower()]
        
        # Filter by topic if provided
        if topic:
            works = [w for w in works if any(topic.lower() in t.lower() for t in w["topics"])]
        
        return works
    
    def analyze_text(self, text: str) -> Dict:
        """
        Analyze Islamic text to extract key concepts and references.
        
        Args:
            text: Islamic text to analyze
            
        Returns:
            Analysis results
        """
        analysis = {
            "concepts": [],
            "references": {
                "quran": [],
                "hadith": [],
                "scholars": []
            },
            "topics": []
        }
        
        # Extract Quranic references
        quran_pattern = r'(?:Quran|القرآن|قرآن)\s+(\d+):(\d+(?:-\d+)?)'
        for match in re.finditer(quran_pattern, text, re.IGNORECASE):
            surah, verse = match.groups()
            analysis["references"]["quran"].append(f"{surah}:{verse}")
        
        # Extract hadith references
        hadith_collections = "|".join(self.primary_sources["hadith"].values())
        hadith_pattern = fr'(?:{hadith_collections})\s+(?:حديث\s+)?(?:رقم\s+)?(\d+)'
        for match in re.finditer(hadith_pattern, text, re.IGNORECASE):
            collection = next((k for k, v in self.primary_sources["hadith"].items() 
                              if v in match.group(0)), "unknown")
            number = match.group(1)
            analysis["references"]["hadith"].append(f"{collection}:{number}")
        
        # Identify key Islamic concepts (simplified)
        concepts = [
            "توحيد", "شريعة", "عقيدة", "فقه", "أخلاق", "تزكية", 
            "سيرة", "صلاة", "زكاة", "صيام", "حج"
        ]
        analysis["concepts"] = [c for c in concepts if c in text]
        
        # Analyze topics (would use more sophisticated NLP in real implementation)
        if "عقيدة" in text or "توحيد" in text:
            analysis["topics"].append("العقيدة")
        if "فقه" in text or "شريعة" in text:
            analysis["topics"].append("الفقه")
        if "أخلاق" in text or "تزكية" in text:
            analysis["topics"].append("الأخلاق")
        
        return analysis

# Example usage
if __name__ == "__main__":
    # Create the Islamic knowledge system
    system = IslamicKnowledgeSystem()
    
    # Example query
    query = "ما هو حكم الصلاة في السفر؟"
    response = system.process_query(query, madhab="shafii")
    
    print("Query:", query)
    print("\nResponse:", response["response"])
    print("\nSources:")
    for source_type, sources in response["sources"].items():
        if sources and source_type != "invalid":
            print(f"  {source_type.capitalize()}:")
            for source in sources:
                print(f"    - {source['citation']} (Valid: {source['valid']})")
    
    print("\nScholarly Analysis:", response["scholarly_analysis"])

    def get_personalized_suggestions(self, user_id: Optional[str], current_query: str, context: List[Dict]) -> List[Dict]:
        """
        Generate personalized learning suggestions based on user history and current query.
        Placeholder for future implementation.
        """
        if not user_id:
            return []

        # In a real system, this would query user interaction history, preferences, etc.
        # For now, return some generic suggestions based on the query or context
        suggestions = []
        if "fiqh" in current_query.lower() or any("fiqh" in msg.get("content", "").lower() for msg in context):
            suggestions.append({
                "title": "Explore Fiqh of Worship",
                "description": "Deepen your understanding of prayer, fasting, and Zakat.",
                "type": "learning_path_topic"
            })
        if "aqeedah" in current_query.lower():
            suggestions.append({
                "title": "Foundations of Aqeedah",
                "description": "Learn about the core tenets of Islamic belief.",
                "type": "learning_path_topic"
            })
        
        logger.info(f"Generated {len(suggestions)} personalized suggestions for user {user_id[:8] if user_id else 'anonymous'}")
        return suggestions

    def advanced_source_search(self, search_term: str, filters: Optional[Dict] = None) -> List[Dict]:
        """
        Perform an advanced search across Islamic sources.
        Placeholder for future implementation with actual data and search algorithms.
        """
        logger.info(f"Performing advanced search for: {search_term} with filters: {filters}")
        # Mock results for now, in a real system this would query a proper database/search index
        mock_results = []
        if "quran" in search_term.lower() or (filters and filters.get("type") == "quran"):
            mock_results.append({
                "title": "Surah Al-Fatiha",
                "content_snippet": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَنِ الرَّحِيمِ...",
                "type": "quran",
                "reference": "1:1-7",
                "relevance_score": 0.9
            })
        if "hadith" in search_term.lower() or (filters and filters.get("type") == "hadith"):
            mock_results.append({
                "title": "Hadith on Intentions (Niyyah)",
                "content_snippet": "إنما الأعمال بالنيات...",
                "type": "hadith",
                "reference": "Sahih al-Bukhari: 1",
                "relevance_score": 0.85
            })
        if "ghazali" in search_term.lower() or (filters and filters.get("author") == "Al-Ghazali"):
            mock_results.append({
                "title": "Ihya Ulum al-Din - Book on Knowledge",
                "content_snippet": "The pursuit of knowledge is an obligation...",
                "type": "scholarly_work",
                "author": "Abu Hamid Al-Ghazali",
                "reference": "Ihya, Book 1, Chapter 1",
                "relevance_score": 0.78
            })
        
        # Simulate filtering if any
        if filters:
            # This is a very basic filter simulation
            if "type" in filters:
                mock_results = [r for r in mock_results if r["type"] == filters["type"]]
            if "author" in filters:
                mock_results = [r for r in mock_results if filters["author"] in r.get("author", "")]

        logger.info(f"Found {len(mock_results)} results for advanced search: {search_term}")
        return mock_results

    def process_query(self, query: str, madhab: str = None, context: List[Dict] = None, user_id: Optional[str] = None) -> Dict:
        """
        Process an Islamic knowledge query and return a response with sources.
        
        Args:
            query: The user's query about Islamic knowledge
            madhab: Optional specific madhab (school of thought) to prioritize
            context: Optional conversation context
            user_id: Optional user identifier for personalization
            
        Returns:
            Dictionary containing the response, sources, and related information
        """
        start_time = time.time()
        logger.info(f"Processing query: {query}")
        
        # Prepare the prompt with appropriate context
        prompt = self._prepare_islamic_prompt(query, madhab, context)
        
        # Get response from the model
        response = self._get_model_response(prompt)
        
        # Extract and validate sources
        processed_response = self._process_and_validate_response(response)
        
        # Add personalized suggestions if user_id is available
        if user_id:
            suggestions = self.get_personalized_suggestions(user_id, query, context or [])
            processed_response["personalized_suggestions"] = suggestions
        else:
            processed_response["personalized_suggestions"] = []

        elapsed_time = time.time() - start_time
        logger.info(f"Query processed in {elapsed_time:.2f} seconds")
        
        return processed_response
    
    def _prepare_islamic_prompt(self, query: str, madhab: str = None, context: List[Dict] = None) -> List[Dict]:
        """
        Prepare a prompt with Islamic knowledge context.
        
        Args:
            query: The user's query
            madhab: Optional madhab to prioritize
            context: Optional conversation context
            
        Returns:
            Formatted prompt for the model
        """
        messages = [
            {"role": "system", "content": self.config.get("system_message")}
        ]
        
        # Add specific guidance based on madhab if provided
        if madhab and madhab in self.madhabs:
            madhab_guidance = (
                f"المستخدم يتبع المذهب {self.madhabs[madhab]}. "
                f"يرجى إعطاء الأولوية لآراء هذا المذهب في الإجابة، "
                f"مع ذكر الآراء الأخرى إذا كانت مهمة للسياق."
            )
            messages[0]["content"] += f"\n\n{madhab_guidance}"
        
        # Add context if available
        if context:
            for msg in context:
                # Ensure context messages have 'role' and 'content'
                if "role" in msg and "content" in msg:
                    messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add the current user query
        messages.append({"role": "user", "content": query})
        
        # Add guidance for priority scholars
        priority_scholars_guidance = (
            f"Please give special consideration to the works and opinions of the following scholars if relevant: "
            f"{', '.join(self.priority_scholars)}. However, always prioritize primary sources (Quran and Sunnah)."
        )
        messages[0]["content"] += f"\n\n{priority_scholars_guidance}"

        logger.debug(f"Prepared prompt: {json.dumps(messages, ensure_ascii=False, indent=2)}")
        return messages
    
    def _get_model_response(self, prompt: List[Dict]) -> str:
        """
        Get a response from the language model.
        
        Args:
            prompt: Formatted prompt for the model
            
        Returns:
            Model's response text
        """
        try:
            if self.config.get("api_type") == "azure":
                response = openai.ChatCompletion.create(
                    deployment_id=self.config.get("deployment_name"),
                    messages=prompt,
                    temperature=0.3,  # Lower temperature for more factual responses
                    max_tokens=2000,
                    top_p=0.95,
                    frequency_penalty=0,
                    presence_penalty=0,
                    stop=None
                )
            else:
                # For OpenAI API
                response = openai.ChatCompletion.create(
                    model=self.config.get("model_name", "gpt-4"),
                    messages=prompt,
                    temperature=0.3,
                    max_tokens=2000,
                    top_p=0.95,
                    frequency_penalty=0,
                    presence_penalty=0,
                    stop=None
                )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Error getting model response: {e}")
            return "حدث خطأ في معالجة الاستعلام. يرجى المحاولة مرة أخرى."
    
    def _process_and_validate_response(self, response: str) -> Dict:
        """
        Process, validate, and enhance the model's response.
        
        Args:
            response: The raw model response
            
        Returns:
            Processed response with validated sources and additional info
        """
        # Extract sources from the response
        sources = self._extract_sources(response)
        
        # Validate the extracted sources
        validated_sources = self._validate_sources(sources)
        
        # Check for inappropriate content
        is_appropriate = self._check_appropriateness(response)
        
        # Format the response with enhanced source formatting
        formatted_response = self._format_response(response)
        
        return {
            "response": formatted_response,
            "sources": validated_sources,
            "is_appropriate": is_appropriate,
            "scholarly_analysis": self._extract_scholarly_context(response)
        }
    
    def _extract_sources(self, response: str) -> Dict:
        """
        Extract sources cited in the response.
        
        Args:
            response: The model's response
            
        Returns:
            Dictionary of extracted sources by type
        """
        sources = {
            "quran": [],
            "hadith": [],
            "scholars": []
        }
        
        # Extract Quranic citations (e.g., "Quran 2:255" or "سورة البقرة آية 255")
        quran_patterns = [
            r'(?:Quran|القرآن|قرآن)\s+(\d+):(\d+(?:-\d+)?)',
            r'سورة\s+\w+\s+آية\s+(\d+(?:-\d+)?)'
        ]
        
        for pattern in quran_patterns:
            matches = re.finditer(pattern, response, re.IGNORECASE)
            for match in matches:
                if len(match.groups()) >= 1:
                    surah = match.group(1) if len(match.groups()) >= 2 else "?"
                    verse = match.group(2) if len(match.groups()) >= 2 else match.group(1)
                    sources["quran"].append(f"{surah}:{verse}")
        
        # Extract Hadith citations
        hadith_collections = "|".join(self.primary_sources["hadith"].values())
        hadith_pattern = fr'(?:{hadith_collections})\s+(?:حديث\s+)?(?:رقم\s+)?(\d+)'
        
        for match in re.finditer(hadith_pattern, response, re.IGNORECASE):
            collection = next((k for k, v in self.primary_sources["hadith"].items() 
                              if v in match.group(0)), "unknown")
            number = match.group(1)
            sources["hadith"].append(f"{collection}:{number}")
        
        # Extract scholar citations
        scholar_pattern = r'(?:' + '|'.join(self.priority_scholars) + r')\s+في\s+(?:كتاب|كتابه)?\s+([^،.]+)'
        for match in re.finditer(scholar_pattern, response, re.IGNORECASE):
            scholar = next((s for s in self.priority_scholars if s in match.group(0)), "unknown")
            book = match.group(1).strip()
            sources["scholars"].append(f"{scholar}:{book}")
        
        return sources
    
    def _validate_sources(self, sources: Dict) -> Dict:
        """
        Validate extracted sources against the sources database.
        
        Args:
            sources: Dictionary of extracted sources
            
        Returns:
            Dictionary of validated sources with additional metadata
        """
        validated = {
            "quran": [],
            "hadith": [],
            "scholars": [],
            "invalid": []
        }
        
        # Validate Quranic citations
        for citation in sources["quran"]:
            if citation in self.sources_db["quran"]:
                validated["quran"].append({
                    "citation": citation,
                    "text": self.sources_db["quran"][citation],
                    "valid": True
                })
            else:
                # In a real implementation, this would check an actual Quran database
                # Here we assume citations not in our sample data are potentially valid
                validated["quran"].append({
                    "citation": citation,
                    "text": "النص غير متوفر في قاعدة البيانات المحلية",
                    "valid": "unknown"
                })
        
        # Validate Hadith citations
        for citation in sources["hadith"]:
            if citation in self.sources_db["hadith"]:
                validated["hadith"].append({
                    "citation": citation,
                    "text": self.sources_db["hadith"][citation],
                    "valid": True
                })
            else:
                validated["hadith"].append({
                    "citation": citation,
                    "text": "النص غير متوفر في قاعدة البيانات المحلية",
                    "valid": "unknown"
                })
        
        # Validate scholar citations
        for citation in sources["scholars"]:
            parts = citation.split(":")
            if len(parts) >= 2:
                scholar, book = parts[0], parts[1]
                key = f"{scholar}:{book}:1"  # Simplified key for demonstration
                
                if key in self.sources_db["scholars"]:
                    validated["scholars"].append({
                        "citation": citation,
                        "text": self.sources_db["scholars"][key],
                        "valid": True
                    })
                else:
                    validated["scholars"].append({
                        "citation": citation,
                        "text": "النص غير متوفر في قاعدة البيانات المحلية",
                        "valid": "unknown"
                    })
            else:
                validated["invalid"].append(citation)
        
        return validated
    
    def _check_appropriateness(self, response: str) -> bool:
        """
        Check if the response contains appropriate Islamic content.
        
        Args:
            response: The model's response
            
        Returns:
            Boolean indicating if the response is appropriate
        """
        # In a real implementation, this would use a more sophisticated approach
        # For now, we use a simple keyword check for demonstration
        inappropriate_terms = [
            "موسيقى", "غناء", "رقص", "أغاني",  # Potentially sensitive topics
            "haram music", "dancing",  # English equivalents
            "آلات موسيقية", "أفلام إباحية"  # Other sensitive terms
        ]
        
        return not any(term in response.lower() for term in inappropriate_terms)
    
    def _format_response(self, response: str) -> str:
        """
        Format the response for better readability and source highlighting.
        
        Args:
            response: The model's response
            
        Returns:
            Formatted response
        """
        # In a real implementation, this would add formatting to highlight sources
        # For simplicity, we return the original response here
        return response
    
    def _extract_scholarly_context(self, response: str) -> Dict:
        """
        Extract scholarly analysis and context from the response.
        
        Args:
            response: The model's response
            
        Returns:
            Dictionary with scholarly context
        """
        # In a real implementation, this would analyze the scholarly content
        # For now, return a simple structure
        return {
            "scholars_mentioned": [s for s in self.priority_scholars if s in response],
            "has_multiple_opinions": any(f"({m})" in response for m in self.madhabs.values()),
            "scholarly_depth": "medium"  # Would be determined by analysis
        }
    
    def get_scholarly_works(self, scholar: str = None, topic: str = None) -> List[Dict]:
        """
        Get scholarly works relevant to a scholar or topic.
        
        Args:
            scholar: Optional scholar name to filter by
            topic: Optional topic to search for
            
        Returns:
            List of matching scholarly works
        """
        # In a real implementation, this would query a database
        # For demonstration, we return sample data
        works = [
            {
                "author": "Abu Hamid Al-Ghazali",
                "title": "إحياء علوم الدين",
                "topics": ["أخلاق", "تزكية", "فقه", "تصوف"],
                "time_period": "classical"
            },
            {
                "author": "Muhammad Al-Ghazali",
                "title": "فقه السيرة",
                "topics": ["سيرة", "فقه"],
                "time_period": "contemporary"
            },
            {
                "author": "Ibrahim al-Sakran",
                "title": "التنوير الزائف",
                "topics": ["فكر", "فلسفة"],
                "time_period": "contemporary"
            }
        ]
        
        # Filter by scholar if provided
        if scholar:
            works = [w for w in works if scholar.lower() in w["author"].lower()]
        
        # Filter by topic if provided
        if topic:
            works = [w for w in works if any(topic.lower() in t.lower() for t in w["topics"])]
        
        return works
    
    def analyze_text(self, text: str) -> Dict:
        """
        Analyze Islamic text to extract key concepts and references.
        
        Args:
            text: Islamic text to analyze
            
        Returns:
            Analysis results
        """
        analysis = {
            "concepts": [],
            "references": {
                "quran": [],
                "hadith": [],
                "scholars": []
            },
            "topics": []
        }
        
        # Extract Quranic references
        quran_pattern = r'(?:Quran|القرآن|قرآن)\s+(\d+):(\d+(?:-\d+)?)'
        for match in re.finditer(quran_pattern, text, re.IGNORECASE):
            surah, verse = match.groups()
            analysis["references"]["quran"].append(f"{surah}:{verse}")
        
        # Extract hadith references
        hadith_collections = "|".join(self.primary_sources["hadith"].values())
        hadith_pattern = fr'(?:{hadith_collections})\s+(?:حديث\s+)?(?:رقم\s+)?(\d+)'
        for match in re.finditer(hadith_pattern, text, re.IGNORECASE):
            collection = next((k for k, v in self.primary_sources["hadith"].items() 
                              if v in match.group(0)), "unknown")
            number = match.group(1)
            analysis["references"]["hadith"].append(f"{collection}:{number}")
        
        # Identify key Islamic concepts (simplified)
        concepts = [
            "توحيد", "شريعة", "عقيدة", "فقه", "أخلاق", "تزكية", 
            "سيرة", "صلاة", "زكاة", "صيام", "حج"
        ]
        analysis["concepts"] = [c for c in concepts if c in text]
        
        # Analyze topics (would use more sophisticated NLP in real implementation)
        if "عقيدة" in text or "توحيد" in text:
            analysis["topics"].append("العقيدة")
        if "فقه" in text or "شريعة" in text:
            analysis["topics"].append("الفقه")
        if "أخلاق" in text or "تزكية" in text:
            analysis["topics"].append("الأخلاق")
        
        return analysis

# Example usage
if __name__ == "__main__":
    # Create the Islamic knowledge system
    system = IslamicKnowledgeSystem()
    
    # Example query
    query = "ما هو حكم الصلاة في السفر؟"
    response = system.process_query(query, madhab="shafii")
    
    print("Query:", query)
    print("\nResponse:", response["response"])
    print("\nSources:")
    for source_type, sources in response["sources"].items():
        if sources and source_type != "invalid":
            print(f"  {source_type.capitalize()}:")
            for source in sources:
                print(f"    - {source['citation']} (Valid: {source['valid']})")
    
    print("\nScholarly Analysis:", response["scholarly_analysis"])
