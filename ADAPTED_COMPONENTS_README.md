# Adapted Components from Hack2

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
