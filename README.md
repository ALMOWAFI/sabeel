# Sabeel (سبيل) - Islamic Knowledge Platform

## About Sabeel

Sabeel (سبيل) is a comprehensive Islamic knowledge platform built to serve scholars, technologists, and the Muslim community at large. The platform integrates cutting-edge AI technology with rich Islamic content to provide a modern, accessible interface for Islamic knowledge exploration.

## Features

- **Interactive Quran Explorer**: Navigate and study the Quran with advanced search capabilities
- **Hadith Search**: Find authentic hadiths across multiple collections
- **Knowledge Graph**: Visualize connections between Islamic concepts and scholars
- **AI Assistant**: Sabeel Chatbot for answering Islamic questions
- **Scholar Dashboard**: Tools specifically designed for Islamic scholars
- **Community Forums**: Spaces for discussion and collaboration
- **Job Openings Board**: Find and apply for jobs in Islamic organizations
- **WhatsApp Group Join**: Connect with community groups via WhatsApp

## Technologies Used

This project is built with:

- React
- TypeScript
- Vite
- Supabase (for authentication and database)
- TensorFlow.js (for AI-powered features)
- shadcn-ui
- Tailwind CSS
- TanStack Query for API handling

## Getting Started

To set up this project locally:

```sh
# Clone the repository
git clone https://github.com/ALMOWAFI/sabeel.git

# Navigate to the project directory
cd sabeel

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Start the development server
npm run dev
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema in `supabase/schema.sql` in the SQL Editor
3. Update your environment variables with your Supabase project credentials

## Project Structure

- `/src/components`: UI components and Islamic knowledge tools
- `/src/pages`: Application pages (Dashboard, Resources, etc.)
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and configuration files
- `/model_integration`: AI model integration for Islamic knowledge
