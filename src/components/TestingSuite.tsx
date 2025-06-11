import React, { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { AuthService } from '../services/AuthService'
import { CollaborationService } from '../services/CollaborationService'
import { PerformanceService } from '../services/PerformanceService'

export default function TestingSuite() {
  const [activeTab, setActiveTab] = useState<'auth' | 'knowledge' | 'collab' | 'ai'>('auth')
  const [authService] = useState(() => new AuthService())
  const [performanceService] = useState(() => new PerformanceService())
  
  // Authentication state
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  
  // Knowledge graph state
  const [knowledgeNodes, setKnowledgeNodes] = useState<any[]>([])
  const [knowledgeLoading, setKnowledgeLoading] = useState(false)
  
  // Collaboration state
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [collaborationService, setCollaborationService] = useState<CollaborationService | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  // AI state
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Authentication Tests
  const testSignUp = async () => {
    setAuthLoading(true)
    setAuthMessage('')
    try {
      if (!isSupabaseConfigured()) {
        setAuthMessage('⚠️ Supabase not configured. Please add your Supabase URL and keys to .env file')
        return
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: 'test@sabeel.com',
        password: 'testpassword123',
        options: {
          data: {
            name: 'Test User'
          }
        }
      })
      
      if (error) throw error
      
      setUser(data.user)
      setAuthMessage('✅ Sign up successful! Check your email for verification.')
    } catch (error: any) {
      setAuthMessage(`❌ Sign up failed: ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const testSignIn = async () => {
    setAuthLoading(true)
    setAuthMessage('')
    try {
      if (!isSupabaseConfigured()) {
        setAuthMessage('⚠️ Supabase not configured. Please add your Supabase URL and keys to .env file')
        return
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@sabeel.com',
        password: 'testpassword123'
      })
      
      if (error) throw error
      
      setUser(data.user)
      setAuthMessage('✅ Sign in successful!')
    } catch (error: any) {
      setAuthMessage(`❌ Sign in failed: ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const testSignOut = async () => {
    setAuthLoading(true)
    setAuthMessage('')
    try {
      await supabase.auth.signOut()
      setUser(null)
      setAuthMessage('✅ Sign out successful!')
    } catch (error: any) {
      setAuthMessage(`❌ Sign out failed: ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  // Knowledge Graph Tests
  const testKnowledgeGraph = async () => {
    setKnowledgeLoading(true)
    try {
      if (!isSupabaseConfigured()) {
        // Demo data if Supabase not configured
        setKnowledgeNodes([
          { id: 1, title: 'Al-Fatiha', type: 'verse', content: 'The opening chapter of the Quran' },
          { id: 2, title: 'Prophet Muhammad (PBUH)', type: 'person', content: 'The final messenger of Allah' },
          { id: 3, title: 'Tawhid', type: 'concept', content: 'The concept of monotheism in Islam' },
          { id: 4, title: 'Mecca', type: 'location', content: 'The holiest city in Islam' }
        ])
        return
      }
      
      const { data, error } = await supabase
        .from('knowledge_nodes')
        .select('*')
        .limit(10)
      
      if (error) throw error
      
      setKnowledgeNodes(data || [])
    } catch (error: any) {
      console.error('Knowledge graph error:', error)
      // Fallback to demo data
      setKnowledgeNodes([
        { id: 1, title: 'Demo: Al-Fatiha', type: 'verse', content: 'The opening chapter of the Quran' },
        { id: 2, title: 'Demo: Tawhid', type: 'concept', content: 'The concept of monotheism in Islam' }
      ])
    } finally {
      setKnowledgeLoading(false)
    }
  }

  // Collaboration Tests
  const testCollaboration = () => {
    try {
      if (collaborationService) {
        collaborationService.disconnect()
        setCollaborationService(null)
        setIsConnected(false)
        setCollaborators([])
        return
      }
      
      const userId = user?.id || 'demo-user-' + Math.random().toString(36).substr(2, 9)
      const docId = 'test-document'
      
      const collab = new CollaborationService(docId, userId)
      
      collab.on('connected', () => {
        setIsConnected(true)
        setCollaborators(prev => [...prev, userId])
      })
      
      collab.on('collaborator_joined', (collaborator: any) => {
        setCollaborators(prev => [...prev.filter(c => c !== collaborator.id), collaborator.id])
      })
      
      collab.on('collaborator_left', (collaboratorId: string) => {
        setCollaborators(prev => prev.filter(c => c !== collaboratorId))
      })
      
      collab.on('disconnected', () => {
        setIsConnected(false)
      })
      
      setCollaborationService(collab)
      
      // Simulate another user joining (demo)
      setTimeout(() => {
        setCollaborators(prev => [...prev, 'demo-collaborator-1', 'demo-collaborator-2'])
      }, 2000)
      
    } catch (error: any) {
      console.error('Collaboration error:', error)
    }
  }

  // AI Tests
  const testAIFeature = async () => {
    if (!aiQuestion.trim()) return
    
    setAiLoading(true)
    setAiResponse('')
    try {
      const geminiApiKey = import.meta.env.REACT_APP_GEMINI_API_KEY
      
      if (!geminiApiKey || geminiApiKey === 'your-gemini-api-key') {
        setAiResponse('⚠️ Gemini API key not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file')
        return
      }
      
      // Simulate AI response (replace with actual Gemini API call)
      setAiResponse('🤖 AI Response: This is a simulated response about Islamic knowledge. In a real implementation, this would connect to Gemini API to provide authentic Islamic guidance and education.')
      
    } catch (error: any) {
      setAiResponse(`❌ AI request failed: ${error.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  const TabButton = ({ tab, label, isActive, onClick }: any) => (
    <button
      className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🕌 Sabeel Platform Testing Suite
          </h1>
          <p className="text-xl text-gray-600">
            Test all platform features: Authentication, Knowledge Graph, Collaboration & AI
          </p>
        </div>

        {/* Configuration Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🔧 Configuration Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={`p-3 rounded ${isSupabaseConfigured() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <strong>Supabase:</strong> {isSupabaseConfigured() ? '✅ Configured' : '❌ Not Configured'}
            </div>
            <div className={`p-3 rounded ${import.meta.env.REACT_APP_GEMINI_API_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <strong>Gemini AI:</strong> {import.meta.env.REACT_APP_GEMINI_API_KEY ? '✅ Configured' : '❌ Not Configured'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <TabButton 
            tab="auth" 
            label="🔐 Authentication" 
            isActive={activeTab === 'auth'} 
            onClick={() => setActiveTab('auth')} 
          />
          <TabButton 
            tab="knowledge" 
            label="📚 Knowledge Graph" 
            isActive={activeTab === 'knowledge'} 
            onClick={() => setActiveTab('knowledge')} 
          />
          <TabButton 
            tab="collab" 
            label="🤝 Collaboration" 
            isActive={activeTab === 'collab'} 
            onClick={() => setActiveTab('collab')} 
          />
          <TabButton 
            tab="ai" 
            label="🤖 AI Features" 
            isActive={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          
          {/* Authentication Tab */}
          {activeTab === 'auth' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">🔐 Authentication Testing</h2>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={testSignUp}
                  disabled={authLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {authLoading ? 'Loading...' : 'Test Sign Up'}
                </button>
                
                <button
                  onClick={testSignIn}
                  disabled={authLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {authLoading ? 'Loading...' : 'Test Sign In'}
                </button>
                
                <button
                  onClick={testSignOut}
                  disabled={authLoading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {authLoading ? 'Loading...' : 'Test Sign Out'}
                </button>
              </div>
              
              {authMessage && (
                <div className="p-4 bg-gray-100 rounded-lg mb-4">
                  <p className="font-medium">{authMessage}</p>
                </div>
              )}
              
              {user && (
                <div className="p-4 bg-green-100 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Current User:</h3>
                  <p>Email: {user.email}</p>
                  <p>ID: {user.id}</p>
                  <p>Created: {new Date(user.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Knowledge Graph Tab */}
          {activeTab === 'knowledge' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">📚 Islamic Knowledge Graph</h2>
              
              <button
                onClick={testKnowledgeGraph}
                disabled={knowledgeLoading}
                className="mb-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {knowledgeLoading ? 'Loading...' : 'Load Knowledge Nodes'}
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeNodes.map((node) => (
                  <div key={node.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{node.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {node.type}
                      </span>
                    </div>
                    <p className="text-gray-600">{node.content}</p>
                  </div>
                ))}
              </div>
              
              {knowledgeNodes.length === 0 && !knowledgeLoading && (
                <p className="text-gray-500 text-center py-8">
                  Click "Load Knowledge Nodes" to explore Islamic concepts, verses, and historical events.
                </p>
              )}
            </div>
          )}

          {/* Collaboration Tab */}
          {activeTab === 'collab' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">🤝 Real-time Collaboration</h2>
              
              <div className="mb-6">
                <button
                  onClick={testCollaboration}
                  className={`py-3 px-6 rounded-lg text-white font-medium ${
                    isConnected 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isConnected ? 'Disconnect from Collaboration' : 'Start Collaboration Session'}
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Connection Status:</h3>
                <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {isConnected ? '✅ Connected to collaboration session' : '❌ Not connected'}
                </div>
              </div>
              
              {collaborators.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Active Collaborators ({collaborators.length}):</h3>
                  <div className="space-y-2">
                    {collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{collaborator}</span>
                        <span className="text-sm text-gray-500">Online</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Features Available:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Real-time document editing</li>
                  <li>Live cursor tracking</li>
                  <li>User presence indicators</li>
                  <li>Comment and annotation system</li>
                  <li>Auto-reconnection on network issues</li>
                </ul>
              </div>
            </div>
          )}

          {/* AI Features Tab */}
          {activeTab === 'ai' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">🤖 AI-Powered Islamic Learning</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ask a question about Islam:
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g., What is the significance of Al-Fatiha?"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && testAIFeature()}
                  />
                  <button
                    onClick={testAIFeature}
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {aiLoading ? 'Processing...' : 'Ask AI'}
                  </button>
                </div>
              </div>
              
              {aiResponse && (
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">AI Response:</h3>
                  <p className="text-blue-800">{aiResponse}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setAiQuestion('What are the five pillars of Islam?')
                    testAIFeature()
                  }}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-semibold text-blue-900">Five Pillars</h4>
                  <p className="text-sm text-gray-600">Learn about the fundamental acts of worship</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiQuestion('Explain the concept of Tawhid in Islam')
                    testAIFeature()
                  }}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-semibold text-blue-900">Tawhid</h4>
                  <p className="text-sm text-gray-600">Understanding monotheism in Islamic theology</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiQuestion('What is the significance of Ramadan?')
                    testAIFeature()
                  }}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-semibold text-blue-900">Ramadan</h4>
                  <p className="text-sm text-gray-600">The holy month of fasting</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiQuestion('Tell me about Prophet Muhammad (PBUH)')
                    testAIFeature()
                  }}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-semibold text-blue-900">Prophet Muhammad</h4>
                  <p className="text-sm text-gray-600">Learn about the final messenger</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 