#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Sabeel API Server
================

Flask API server that connects the React frontend to the Islamic Knowledge System.
This provides endpoints for chat, knowledge exploration, and user preferences.
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import json
import uuid
import logging
from datetime import datetime
from dotenv import load_dotenv

# Import the Islamic Knowledge System
from model_integration.islamic_knowledge_system import IslamicKnowledgeSystem

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("sabeel_api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("sabeel-api")

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "sabeel-dev-key")

# Initialize the knowledge system
try:
    knowledge_system = IslamicKnowledgeSystem()
    logger.info("Islamic Knowledge System initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Islamic Knowledge System: {e}")
    knowledge_system = None

# User sessions and preferences
user_sessions = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = "healthy" if knowledge_system is not None else "degraded"
    return jsonify({
        "status": status,
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Process chat messages and return AI responses"""
    try:
        data = request.json
        query = data.get('message')
        madhab = data.get('madhab')
        conversation_history = data.get('history', [])
        
        # Get or create session ID
        if request.cookies.get('session_id'):
            session_id = request.cookies.get('session_id')
        else:
            session_id = str(uuid.uuid4())
        
        logger.info(f"Processing chat request for session {session_id[:8]}")
        
        # Check if the knowledge system is available
        if knowledge_system is None:
            logger.warning("Knowledge system unavailable, returning fallback response")
            return jsonify({
                "content": "عذراً، نظام المعرفة الإسلامية غير متاح حالياً. يرجى المحاولة لاحقاً.",
                "sources": [],
                "system_status": "unavailable"
            })
        
        # Process query through the Islamic knowledge system
        response = knowledge_system.process_query(
            query=query,
            madhab=madhab,
            context=conversation_history,
            user_id=session_id  # Pass session_id as user_id for personalization
        )
        
        # Add session ID to response if not already there (it might be added by knowledge_system)
        if "session_id" not in response:
            response["session_id"] = session_id
        
        resp = jsonify(response)
        # Set session_id cookie if it's new or needs to be refreshed
        if not request.cookies.get('session_id') or request.cookies.get('session_id') != session_id:
            resp.set_cookie('session_id', session_id, httponly=True, samesite='Lax')
            
        return resp
    except Exception as e:
        logger.error(f"Error processing chat request: {e}", exc_info=True)
        return jsonify({
            "error": str(e),
            "content": "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
            "system_status": "error"
        }), 500

@app.route('/api/knowledge-graph', methods=['GET'])
def knowledge_graph():
    """Return Islamic knowledge graph data"""
    try:
        topic = request.args.get('topic', 'Islam')
        depth = request.args.get('depth', 2, type=int)
        
        # This would call into the knowledge system to get graph data
        # For now, return a simple mock structure
        graph_data = {
            "nodes": [
                {"id": "Islam", "group": 1, "label": "الإسلام"},
                {"id": "Quran", "group": 2, "label": "القرآن"},
                {"id": "Hadith", "group": 2, "label": "الحديث"},
                {"id": "Fiqh", "group": 2, "label": "الفقه"},
                {"id": "Aqeedah", "group": 2, "label": "العقيدة"}
            ],
            "links": [
                {"source": "Islam", "target": "Quran", "value": 1},
                {"source": "Islam", "target": "Hadith", "value": 1},
                {"source": "Islam", "target": "Fiqh", "value": 1},
                {"source": "Islam", "target": "Aqeedah", "value": 1}
            ]
        }
        
        return jsonify(graph_data)
    except Exception as e:
        logger.error(f"Error fetching knowledge graph: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/user-preferences', methods=['GET', 'POST'])
def user_preferences():
    """Get or update user preferences"""
    if request.method == 'POST':
        try:
            data = request.json
            user_id = request.cookies.get('user_id', str(uuid.uuid4()))
            
            # Update preferences in our store
            if user_id not in user_sessions:
                user_sessions[user_id] = {"preferences": {}}
            
            user_sessions[user_id]["preferences"].update(data)
            
            return jsonify({
                "success": True,
                "message": "تم تحديث التفضيلات بنجاح",
                "preferences": user_sessions[user_id]["preferences"]
            })
        except Exception as e:
            logger.error(f"Error updating user preferences: {e}")
            return jsonify({"error": str(e)}), 500
    else:
        # GET method
        user_id = request.cookies.get('user_id')
        if not user_id or user_id not in user_sessions:
            return jsonify({"preferences": {}})
        
        return jsonify({
            "preferences": user_sessions[user_id].get("preferences", {})
        })

@app.route('/api/sources', methods=['GET'])
def search_sources():
    """Search Islamic sources"""
    try:
        query = request.args.get('query', '')
        source_type = request.args.get('type', 'all')
        
        # This would search the knowledge system's sources
        # For now, return mock data
        sources = [
            {
                "title": "سورة البقرة - الآية 255 (آية الكرسي)",
                "content": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
                "type": "quran",
                "reference": "2:255"
            },
            {
                "title": "صحيح البخاري - كتاب بدء الوحي",
                "content": "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى...",
                "type": "hadith",
                "reference": "البخاري:1"
            }
        ]
        
        return jsonify({"sources": sources, "query": query})
    except Exception as e:
        logger.error(f"Error searching sources: {e}")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    logger.error(f"Server error: {e}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host='0.0.0.0', port=port, debug=debug)
