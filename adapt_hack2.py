#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Adapt Hack2 Components for Sabeel Islamic AI Project
===================================================

This script adapts relevant components from the hack2 project to serve
the Sabeel Islamic knowledge system. It focuses on:
1. OCR capabilities for Arabic text
2. AI model integration infrastructure
3. Web interface components
"""

import os
import shutil
import json
import logging
from typing import List, Dict, Any
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel-adapt-hack2")

# Paths
HACK2_PATH = r"c:\Users\Aliel\OneDrive - Constructor University\Desktop\sabeel\hack2"
SABEEL_PATH = r"c:\Users\Aliel\OneDrive - Constructor University\Desktop\sabeel\sabeel-tech-awakening"

# Components to adapt
COMPONENTS = {
    "ocr": {
        "source_files": [
            "process_uploaded_images.py",
            "test_error_localization.py",
            "test_math_ocr.py"  # Will adapt for Arabic OCR
        ],
        "target_dir": "arabic_ocr"
    },
    "model_integration": {
        "source_files": [
            "enhanced_math_system.py",  # Will adapt for Islamic knowledge models
            "azure_config.json",
            "set_azure_credentials.py"
        ],
        "target_dir": "model_integration"
    },
    "web_interface": {
        "source_files": [
            "enhanced_web_server.py",
            "templates",
            "static"
        ],
        "target_dir": "web_interface"
    }
}

def create_target_directories():
    """Create the target directories for adapted components."""
    for component, info in COMPONENTS.items():
        target_path = os.path.join(SABEEL_PATH, info["target_dir"])
        os.makedirs(target_path, exist_ok=True)
        logger.info(f"Created directory: {target_path}")

def copy_and_adapt_files():
    """Copy and adapt files from hack2 to Sabeel project."""
    for component, info in COMPONENTS.items():
        target_dir = os.path.join(SABEEL_PATH, info["target_dir"])
        
        for source_file in info["source_files"]:
            source_path = os.path.join(HACK2_PATH, source_file)
            
            # Handle directories
            if os.path.isdir(source_path):
                target_path = os.path.join(target_dir, os.path.basename(source_file))
                if os.path.exists(target_path):
                    shutil.rmtree(target_path)
                shutil.copytree(source_path, target_path)
                logger.info(f"Copied directory: {source_file} -> {target_path}")
            # Handle files
            elif os.path.isfile(source_path):
                target_path = os.path.join(target_dir, os.path.basename(source_file))
                shutil.copy(source_path, target_path)
                logger.info(f"Copied file: {source_file} -> {target_path}")
                
                # Adapt file content if needed
                adapt_file_content(target_path, component)
            else:
                logger.warning(f"Source not found: {source_path}")

def adapt_file_content(file_path, component):
    """Adapt file content for Sabeel project."""
    if not os.path.exists(file_path) or os.path.isdir(file_path):
        return
    
    # Skip binary and non-text files
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        logger.info(f"Skipping binary file: {file_path}")
        return
    
    new_content = content
    
    # Adapt OCR components for Arabic
    if component == "ocr":
        new_content = content.replace("tesseract_cmd.exe", "tesseract_cmd.exe --lang ara")
        new_content = new_content.replace("image_to_string", "image_to_string(image, lang='ara+eng')")
        
        # Add Arabic OCR configuration
        if "test_math_ocr.py" in file_path:
            new_content = """# -*- coding: utf-8 -*-
\"\"\"
Arabic OCR for Sabeel Islamic Knowledge Project
Adapted from math OCR in hack2
\"\"\"

import pytesseract
from PIL import Image
import cv2
import numpy as np
import os
import re

# Configure Tesseract for Arabic
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def preprocess_arabic_image(image_path):
    \"\"\"Preprocess image for better Arabic OCR results.\"\"\"
    # Load image
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply dilation and erosion to remove noise
    kernel = np.ones((1, 1), np.uint8)
    gray = cv2.dilate(gray, kernel, iterations=1)
    gray = cv2.erode(gray, kernel, iterations=1)
    
    # Apply threshold to get binary image
    _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    
    return binary

def ocr_arabic_text(image_path):
    \"\"\"Perform OCR on Arabic text.\"\"\"
    # Preprocess image
    processed_img = preprocess_arabic_image(image_path)
    
    # Save processed image temporarily
    temp_path = "temp_processed.png"
    cv2.imwrite(temp_path, processed_img)
    
    # Perform OCR with Arabic language support
    config = r'--oem 3 --psm 6 -l ara+eng'
    text = pytesseract.image_to_string(Image.open(temp_path), config=config)
    
    # Clean up
    os.remove(temp_path)
    
    return text

def extract_islamic_content(text):
    \"\"\"Extract relevant Islamic content from OCR text.\"\"\"
    # Look for Quranic verses (identified by chapter:verse notation)
    quran_verses = re.findall(r'\\d+:\\d+', text)
    
    # Look for hadith references
    hadith_refs = re.findall(r'صحيح البخاري|صحيح مسلم|سنن أبي داود|سنن الترمذي|سنن النسائي|سنن ابن ماجه', text)
    
    # Look for scholar names
    scholar_names = re.findall(r'ابن تيمية|الغزالي|ابن القيم|ابن كثير', text)
    
    return {
        'quran_verses': quran_verses,
        'hadith_refs': hadith_refs,
        'scholar_names': scholar_names,
        'full_text': text
    }

if __name__ == "__main__":
    # Test with a sample image
    sample_image = "sample_arabic_text.jpg"
    if os.path.exists(sample_image):
        print("Processing sample Arabic text...")
        extracted_text = ocr_arabic_text(sample_image)
        print("Extracted text:")
        print(extracted_text)
        
        content = extract_islamic_content(extracted_text)
        print("\\nExtracted Islamic content:")
        print(json.dumps(content, ensure_ascii=False, indent=2))
    else:
        print(f"Sample image {sample_image} not found.")
"""
    
    # Adapt model integration components
    elif component == "model_integration":
        # Replace math analysis with Islamic knowledge system
        new_content = new_content.replace("math_analyzer", "islamic_knowledge")
        new_content = new_content.replace("MathAnalyzer", "IslamicKnowledgeSystem")
        
        # Update azure_config.json for Islamic models
        if "azure_config.json" in file_path:
            config = {
                "api_type": "azure",
                "api_base": "YOUR_AZURE_ENDPOINT",
                "api_version": "2023-05-15",
                "deployment_name": "islamic-knowledge-gpt-4",
                "model_name": "gpt-4",
                "system_message": "أنت مساعد إسلامي متخصص يسمى 'سبيل'. مهمتك تقديم إجابات دقيقة مستندة إلى المصادر الإسلامية الموثوقة والقرآن الكريم والسنة النبوية والإجماع."
            }
            new_content = json.dumps(config, indent=2, ensure_ascii=False)
    
    # Adapt web interface components
    elif component == "web_interface":
        # Update web server for Islamic knowledge interface
        new_content = new_content.replace("Math Analysis", "Islamic Knowledge")
        new_content = new_content.replace("math_solution", "islamic_answer")
        new_content = new_content.replace("Analyze Math", "Analyze Islamic Text")
    
    # Write modified content back to file
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        logger.info(f"Adapted file content: {file_path}")

def create_integration_script():
    """Create a script to integrate the adapted components with the Sabeel project."""
    integration_script = os.path.join(SABEEL_PATH, "integrate_components.py")
    
    with open(integration_script, 'w', encoding='utf-8') as f:
        f.write("""#!/usr/bin/env python
# -*- coding: utf-8 -*-

\"\"\"
Integration Script for Sabeel Islamic Knowledge System
=====================================================

This script integrates the adapted components from hack2:
1. Arabic OCR system
2. Islamic knowledge model integration
3. Web interface for interacting with the system
\"\"\"

import os
import sys
import logging
from arabic_ocr.arabic_ocr import ocr_arabic_text, extract_islamic_content
from model_integration.islamic_knowledge_system import IslamicKnowledgeSystem
import web_interface.sabeel_web_server as web_server

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel-integration")

def main():
    \"\"\"Main integration function.\"\"\"
    logger.info("Starting Sabeel Islamic Knowledge System...")
    
    # Initialize the knowledge system
    knowledge_system = IslamicKnowledgeSystem()
    
    # Start the web server
    web_server.run(knowledge_system)

if __name__ == "__main__":
    main()
""")
    
    logger.info(f"Created integration script: {integration_script}")

def create_readme():
    """Create a README file for the adapted components."""
    readme_path = os.path.join(SABEEL_PATH, "ADAPTED_COMPONENTS_README.md")
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write("""# Adapted Components from Hack2

This directory contains components adapted from the Hack2 project for use in the Sabeel Islamic Knowledge System.

## Components

### Arabic OCR
Located in the `arabic_ocr` directory, this component provides OCR capabilities specifically optimized for Arabic text. It can:
- Process images containing Arabic text
- Extract Quranic verses, hadith references, and scholar names
- Handle right-to-left text properly

### Model Integration
Located in the `model_integration` directory, this component provides integration with language models (like GPT-4) for Islamic knowledge processing. It:
- Connects to Azure OpenAI or other model providers
- Manages context with Islamic knowledge requirements
- Formats prompts with appropriate Islamic guidance

### Web Interface
Located in the `web_interface` directory, this component provides a user interface for interacting with the Sabeel system. It includes:
- Flask-based web server
- File upload for OCR processing
- Interactive interface for Islamic knowledge questions

## Usage

Run the `integrate_components.py` script to start the Sabeel system with all components integrated.

```
python integrate_components.py
```
""")
    
    logger.info(f"Created README file: {readme_path}")

def main():
    """Main function to adapt hack2 components."""
    logger.info("Starting adaptation of hack2 components...")
    
    # Create target directories
    create_target_directories()
    
    # Copy and adapt files
    copy_and_adapt_files()
    
    # Create integration script
    create_integration_script()
    
    # Create README
    create_readme()
    
    logger.info("Adaptation complete!")

if __name__ == "__main__":
    main()
