#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Integration Script for Sabeel Islamic Knowledge System
=====================================================

This script integrates the components of the Sabeel Islamic Knowledge System:
1. Arabic OCR system for processing Islamic texts in images
2. Islamic knowledge model for answering queries and providing context
3. Web interface for interacting with the system
4. Knowledge graph for connecting Islamic concepts
5. Visualization tools for exploring Islamic knowledge
"""

import os
import sys
import logging
import time
import argparse
from pathlib import Path
import threading

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel-integration")

def check_dependencies():
    """Check and install required dependencies."""
    logger.info("Checking dependencies...")
    
    try:
        import flask
        import werkzeug
        import flask_cors
        import numpy
        import cv2
        import pytesseract
        import openai
        import dotenv
        logger.info("All core dependencies are installed.")
    except ImportError as e:
        logger.warning(f"Missing dependency: {e}")
        logger.info("Installing missing dependencies...")
        
        try:
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", 
                                  "flask", "flask-cors", "numpy", "opencv-python", 
                                  "pytesseract", "openai", "python-dotenv"])
            logger.info("Dependencies installed successfully.")
        except Exception as install_error:
            logger.error(f"Failed to install dependencies: {install_error}")
            logger.error("Please install the required dependencies manually.")
            sys.exit(1)

def check_ocr_support():
    """Check if OCR support is properly configured."""
    logger.info("Checking OCR support...")
    
    try:
        import pytesseract
        pytesseract.get_tesseract_version()
        logger.info("Tesseract OCR is properly installed.")
        
        # Check for Arabic language support
        try:
            langs = pytesseract.get_languages()
            if 'ara' in langs:
                logger.info("Arabic language support is available for OCR.")
            else:
                logger.warning("Arabic language support is not available for Tesseract OCR.")
                logger.warning("Please install the Arabic language pack for Tesseract.")
        except:
            logger.warning("Could not check available languages. Make sure Arabic is supported.")
    except:
        logger.warning("Tesseract OCR is not properly configured.")
        logger.warning("Please install Tesseract OCR and ensure it's in your PATH.")

def create_env_file():
    """Create a .env file if it doesn't exist."""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if not os.path.exists(env_path):
        logger.info("Creating .env file for API configuration...")
        
        with open(env_path, 'w') as f:
            f.write("""# Sabeel Islamic Knowledge System Environment Configuration

# OpenAI API Configuration
OPENAI_API_TYPE=azure  # or 'openai'
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://your-azure-endpoint.openai.azure.com/
OPENAI_API_VERSION=2023-05-15
OPENAI_DEPLOYMENT_NAME=your-deployment-name
OPENAI_MODEL_NAME=gpt-4

# System Message (Arabic)
SYSTEM_MESSAGE=أنت مساعد إسلامي متخصص يسمى 'سبيل'. مهمتك تقديم إجابات دقيقة مستندة إلى المصادر الإسلامية الموثوقة مثل القرآن الكريم والسنة النبوية وآراء العلماء المعتبرين.
""")
        
        logger.info(f"Created .env file at {env_path}")
        logger.info("Please edit this file to add your API keys and configuration.")

def main():
    """Main integration function."""
    parser = argparse.ArgumentParser(description="Sabeel Islamic Knowledge System")
    parser.add_argument('--debug', action='store_true', help='Run in debug mode')
    parser.add_argument('--port', type=int, default=5000, help='Web server port')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Web server host')
    args = parser.parse_args()
    
    logger.info("Starting Sabeel Islamic Knowledge System...")
    
    # Check dependencies
    check_dependencies()
    
    # Check OCR support
    check_ocr_support()
    
    # Create .env file if needed
    create_env_file()
    
    # Import components (after dependency check)
    try:
        from arabic_ocr.arabic_ocr import ocr_arabic_text, extract_islamic_content
        from model_integration.islamic_knowledge_system import IslamicKnowledgeSystem
        import web_interface.sabeel_web_server as web_server
        
        # Initialize the knowledge system
        logger.info("Initializing Islamic Knowledge System...")
        knowledge_system = IslamicKnowledgeSystem()
        
        # Create necessary directories
        os.makedirs(os.path.join(os.path.dirname(__file__), 'web_interface', 'uploads'), exist_ok=True)
        os.makedirs(os.path.join(os.path.dirname(__file__), 'web_interface', 'results'), exist_ok=True)
        os.makedirs(os.path.join(os.path.dirname(__file__), 'web_interface', 'static'), exist_ok=True)
        os.makedirs(os.path.join(os.path.dirname(__file__), 'web_interface', 'templates'), exist_ok=True)
        
        # Start the web server
        logger.info(f"Starting web server on {args.host}:{args.port}...")
        
        # Create a custom run function that uses the provided arguments
        def run_server():
            web_server.app.run(host=args.host, port=args.port, debug=args.debug)
        
        # Pass the knowledge system to the web server
        web_server.knowledge_system = knowledge_system
        
        # Create default templates
        web_server.create_default_templates()
        
        # Start the server
        if args.debug:
            # In debug mode, run directly
            run_server()
        else:
            # In production mode, run in a thread
            server_thread = threading.Thread(target=run_server)
            server_thread.daemon = True
            server_thread.start()
            
            logger.info(f"Server running at http://{args.host}:{args.port}")
            logger.info("Press Ctrl+C to stop the server")
            
            try:
                # Keep the main thread alive
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                logger.info("Shutting down Sabeel Islamic Knowledge System...")
                sys.exit(0)
        
    except ImportError as e:
        logger.error(f"Failed to import required modules: {e}")
        logger.error("Please ensure all components are properly installed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
