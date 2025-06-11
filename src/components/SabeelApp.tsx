import React, { useState, useEffect } from 'react';
import { AuthService, User } from '../services/AuthService';
import { CanvasApiService } from '../services/CanvasApiService';
import { CollaborationService } from '../services/CollaborationService';
import { PerformanceService } from '../services/PerformanceService';
import { KnowledgeExplorer } from './KnowledgeExplorer';

interface SabeelAppProps {
  // Optional props for configuration
  config?: {
    enableCollaboration?: boolean;
    enableCanvasIntegration?: boolean;
    enablePerformanceOptimizations?: boolean;
  };
}

export function SabeelApp({ config = {} }: SabeelAppProps) {
  const [authService] = useState(() => new AuthService());
  const [canvasService] = useState(() => new CanvasApiService());
  const [performanceService] = useState(() => new PerformanceService());
  const [collaborationService, setCollaborationService] = useState<CollaborationService | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'knowledge' | 'canvas' | 'collaboration' | 'profile'>('knowledge');
  
  // Canvas data
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // Collaboration data
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isCollaborating, setIsCollaborating] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is already authenticated
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser);
      }
      
      // Initialize performance optimizations
      if (config.enablePerformanceOptimizations !== false) {
        performanceService.optimizeImages(document.body);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize app');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (currentUser: User) => {
    try {
      // Load Canvas data if integration is enabled
      if (config.enableCanvasIntegration !== false) {
        await loadCanvasData();
      }
      
      // Initialize collaboration if enabled
      if (config.enableCollaboration !== false) {
        initializeCollaboration(currentUser.id);
      }
      
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const loadCanvasData = async () => {
    try {
      // Use performance service for caching
      const cachedCourses = await performanceService.getOrSet(
        'canvas_courses',
        'islamic_courses',
        () => canvasService.getIslamicCourses(),
        { ttl: 10 * 60 * 1000 } // 10 minutes cache
      );
      
      setCourses(cachedCourses);
      
      // Load assignments for the first course
      if (cachedCourses.length > 0) {
        const courseAssignments = await performanceService.getOrSet(
          'canvas_assignments',
          `course_${cachedCourses[0].id}`,
          () => canvasService.getAssignments(cachedCourses[0].id),
          { ttl: 5 * 60 * 1000 } // 5 minutes cache
        );
        
        setAssignments(courseAssignments);
      }
      
    } catch (err) {
      console.error('Failed to load Canvas data:', err);
    }
  };

  const initializeCollaboration = (userId: string) => {
    try {
      const docId = 'main_document'; // In a real app, this would be dynamic
      const collab = new CollaborationService(docId, userId);
      
      // Set up event listeners
      collab.on('collaborator_joined', (collaborator: any) => {
        setCollaborators(prev => [...prev.filter(c => c.id !== collaborator.id), collaborator]);
      });
      
      collab.on('collaborator_left', (userId: string) => {
        setCollaborators(prev => prev.filter(c => c.id !== userId));
      });
      
      collab.on('connected', () => {
        setIsCollaborating(true);
      });
      
      collab.on('disconnected', () => {
        setIsCollaborating(false);
      });
      
      setCollaborationService(collab);
      
    } catch (err) {
      console.error('Failed to initialize collaboration:', err);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const signedInUser = await authService.signIn(email, password);
      setUser(signedInUser);
      await loadUserData(signedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanvasOAuth = async () => {
    try {
      const authUrl = await authService.signInWithCanvas();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Canvas OAuth failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setCourses([]);
      setAssignments([]);
      setCollaborators([]);
      
      if (collaborationService) {
        collaborationService.disconnect();
        setCollaborationService(null);
      }
      
      setIsCollaborating(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  const createQuranAssignment = async (courseId: number) => {
    try {
      const assignment = await canvasService.createQuranAssignment(courseId, {
        name: 'Quranic Reflection Assignment',
        description: 'Reflect on the meanings and lessons from selected Quranic verses.',
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 1 week
        points_possible: 100,
        islamic_content: {
          verses: ['Quran 2:255 (Ayat al-Kursi)', 'Quran 1:1-7 (Al-Fatiha)'],
          topics: ['Divine attributes', 'Prayer and worship'],
          difficulty_level: 'intermediate',
          language: 'both',
        },
      });
      
      // Refresh assignments
      performanceService.clear('canvas_assignments');
      await loadCanvasData();
      
      alert('Quran assignment created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading Sabeel Platform...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
            Sabeel Platform
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={handleCanvasOAuth}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
            >
              Sign in with Canvas LMS
            </button>
            
            <div className="text-center text-gray-500">or</div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value;
              const password = (form.elements.namedItem('password') as HTMLInputElement).value;
              handleSignIn(email, password);
            }}>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-900">Sabeel</h1>
              {isCollaborating && (
                <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Collaborating ({collaborators.length} users)
                </span>
              )}
            </div>
            
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveView('knowledge')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'knowledge' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Knowledge Explorer
              </button>
              
              {config.enableCanvasIntegration !== false && (
                <button
                  onClick={() => setActiveView('canvas')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeView === 'canvas' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Canvas LMS ({courses.length})
                </button>
              )}
              
              {config.enableCollaboration !== false && (
                <button
                  onClick={() => setActiveView('collaboration')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeView === 'collaboration' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Collaboration
                </button>
              )}
              
              <button
                onClick={() => setActiveView('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'profile' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {activeView === 'knowledge' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Islamic Knowledge Explorer</h2>
            <KnowledgeExplorer />
          </div>
        )}

        {activeView === 'canvas' && config.enableCanvasIntegration !== false && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Canvas LMS Integration</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courses */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Islamic Courses ({courses.length})</h3>
                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.id} className="p-3 border rounded">
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.course_code}</p>
                      <button
                        onClick={() => createQuranAssignment(course.id)}
                        className="mt-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        Create Quran Assignment
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignments */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Assignments ({assignments.length})</h3>
                <div className="space-y-3">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="p-3 border rounded">
                      <h4 className="font-medium">{assignment.name}</h4>
                      <p className="text-sm text-gray-600">
                        Due: {assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : 'No due date'}
                      </p>
                      <p className="text-sm text-gray-600">Points: {assignment.points_possible}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'collaboration' && config.enableCollaboration !== false && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-time Collaboration</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Active Collaborators</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isCollaborating ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isCollaborating ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {collaborators.map(collaborator => (
                  <div key={collaborator.id} className="p-3 border rounded flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {collaborator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{collaborator.name}</p>
                      <p className="text-xs text-gray-500">{collaborator.role}</p>
                    </div>
                  </div>
                ))}
                
                {collaborators.length === 0 && (
                  <div className="col-span-3 text-center text-gray-500 py-8">
                    No other collaborators online
                  </div>
                )}
              </div>
              
              {collaborationService && (
                <div className="mt-6 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Collaboration Features Available:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time document editing</li>
                    <li>• Cursor and selection tracking</li>
                    <li>• Comment and annotation system</li>
                    <li>• User presence indicators</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Integration Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Canvas LMS:</span>
                      <span className={user.canvas_user_id ? 'text-green-600' : 'text-gray-400'}>
                        {user.canvas_user_id ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>JupyterHub:</span>
                      <span className={user.jupyter_user_id ? 'text-green-600' : 'text-gray-400'}>
                        {user.jupyter_user_id ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collaboration:</span>
                      <span className={isCollaborating ? 'text-green-600' : 'text-gray-400'}>
                        {isCollaborating ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Performance Stats</h4>
                  <div className="text-sm text-gray-600">
                    <p>Cache: {JSON.stringify(performanceService.getCacheStats(), null, 2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 