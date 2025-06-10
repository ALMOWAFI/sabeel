/**
 * Frontend Integration Script for Sabeel Project
 * 
 * This script helps integrate selected components from the webfrontend folder
 * into the main Sabeel project structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Source directories in webfrontend folder
  sources: {
    edx: path.resolve(__dirname, '../webfrontend/frontend/edx-platform'),
    canvas: path.resolve(__dirname, '../webfrontend/frontend/canvas-lms'),
    h5p: path.resolve(__dirname, '../webfrontend/frontend/h5p-php-library'),
  },
  // Target directories in Sabeel project
  targets: {
    components: path.resolve(__dirname, './src/components/external'),
    services: path.resolve(__dirname, './src/services'),
  },
  // Components to integrate
  components: [
    {
      name: 'EdXCourseCard',
      source: 'edx',
      sourcePath: 'lms/static/js/components',
      files: ['CourseCard.jsx'],
      dependencies: ['react', 'classnames'],
    },
    {
      name: 'CanvasCalendar',
      source: 'canvas',
      sourcePath: 'ui/shared/calendar',
      files: ['Calendar.jsx', 'CalendarEvent.jsx'],
      dependencies: ['react', 'moment'],
    },
    {
      name: 'H5PInteractive',
      source: 'h5p',
      sourcePath: 'js',
      files: ['h5p.js', 'h5p-content-type.js'],
      dependencies: [],
    },
  ],
};

// Create necessary directories
function createDirectories() {
  console.log('Creating necessary directories...');
  
  Object.values(config.targets).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Create index file for external components
function createIndexFile() {
  console.log('Creating index file for external components...');
  
  const indexPath = path.join(config.targets.components, 'index.ts');
  const imports = config.components.map(comp => 
    `export * from './${comp.name}';`
  ).join('\n');
  
  fs.writeFileSync(indexPath, imports);
  console.log(`Created index file at: ${indexPath}`);
}

// Create adapter components
function createAdapterComponents() {
  console.log('Creating adapter components...');
  
  config.components.forEach(component => {
    const componentDir = path.join(config.targets.components, component.name);
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    // Create adapter component file
    const adapterPath = path.join(componentDir, 'index.tsx');
    const adapterContent = generateAdapterCode(component);
    
    fs.writeFileSync(adapterPath, adapterContent);
    console.log(`Created adapter component: ${adapterPath}`);
  });
}

// Generate adapter code based on component type
function generateAdapterCode(component) {
  switch(component.name) {
    case 'EdXCourseCard':
      return `import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CourseProps {
  courseId: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export function EdXCourseCard({ courseId, title, description, imageUrl }: CourseProps) {
  // Adapt the EdX component to work with Sabeel's design system
  return (
    <Card className="overflow-hidden">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        <div className="mt-4">
          <a 
            href={`/course/${courseId}`} 
            className="text-primary hover:underline text-sm font-medium"
          >
            View Course
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export function EdXCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        if (err) { // Defensive check
          setError(String(err));
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(course => (
        <EdXCourseCard
          key={course.id}
          courseId={course.id}
          title={course.title}
          description={course.description}
          imageUrl={course.imageUrl}
        />
      ))}
    </div>
  );
}
`;
    case 'CanvasCalendar':
      return `import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  description?: string;
}

export function CanvasCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // This would be replaced with an actual API call
        // const response = await fetch('/api/calendar/events');
        // if (!response.ok) throw new Error('Failed to fetch events');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          { id: '1', title: 'Islamic Studies Lecture', date: '2023-06-15', type: 'lecture' },
          { id: '2', title: 'Arabic Assignment Due', date: '2023-06-18', type: 'assignment' },
          { id: '3', title: 'Quran Recitation Session', date: '2023-06-20', type: 'other' },
        ];
        
        setEvents(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div>Loading calendar events...</div>;
  if (error) return <div>Error loading calendar: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex items-start space-x-4 p-3 border rounded-md">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                {event.type === 'lecture' && 'L'}
                {event.type === 'assignment' && 'A'}
                {event.type === 'exam' && 'E'}
                {event.type === 'other' && 'O'}
              </div>
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                {event.description && <p className="text-sm mt-1">{event.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
`;
    case 'H5PInteractive':
      return `import { useEffect, useRef } from 'react';

interface H5PInteractiveProps {
  contentId: string;
  contentType: string;
  height?: number;
  width?: string;
}

export function H5PInteractive({ contentId, contentType, height = 400, width = '100%' }: H5PInteractiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for H5P integration
    // In a real implementation, you would load the H5P library and initialize the content
    const container = containerRef.current;
    if (container) {
      container.innerHTML = `
        <div class="h5p-placeholder" style="background-color: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center;">
          <h3>H5P Interactive Content</h3>
          <p>Content ID: ${contentId}</p>
          <p>Type: ${contentType}</p>
          <p>This is a placeholder for H5P content that would be loaded dynamically.</p>
        </div>
      `;
    }

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [contentId, contentType]);

  return (
    <div 
      ref={containerRef} 
      className="h5p-container" 
      style={{ height: `${height}px`, width }}
    />
  );
}
`;
    default:
      return `// Adapter component for ${component.name}
import { useState } from 'react';

export function ${component.name}() {
  return (
    <div>
      <h3>${component.name} Component</h3>
      <p>This is a placeholder for the ${component.name} component.</p>
    </div>
  );
}
`;
  }
}

// Create API service files
function createApiServices() {
  console.log('Creating API service files...');
  
  // Course service
  const courseServicePath = path.join(config.targets.services, 'courseService.ts');
  const courseServiceContent = `
// Course API service

export async function fetchCourses() {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) throw new Error('Failed to fetch courses');
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export async function fetchCourseDetails(courseId: string) {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course details');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
}
`;
  
  fs.writeFileSync(courseServicePath, courseServiceContent);
  console.log(`Created course service at: ${courseServicePath}`);
  
  // Calendar service
  const calendarServicePath = path.join(config.targets.services, 'calendarService.ts');
  const calendarServiceContent = `
// Calendar API service

export async function fetchCalendarEvents() {
  try {
    const response = await fetch('/api/calendar/events');
    if (!response.ok) throw new Error('Failed to fetch calendar events');
    return await response.json();
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

export async function addCalendarEvent(event) {
  try {
    const response = await fetch('/api/calendar/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to add calendar event');
    return await response.json();
  } catch (error) {
    console.error('Error adding calendar event:', error);
    throw error;
  }
}
`;
  
  fs.writeFileSync(calendarServicePath, calendarServiceContent);
  console.log(`Created calendar service at: ${calendarServicePath}`);
}

// Update backend API endpoints
function updateBackendApi() {
  console.log('Updating backend API endpoints...');
  
  const apiRoutesPath = path.join(__dirname, 'api-routes.js');
  const apiRoutesContent = `
// API routes for integrated frontend components

module.exports = function(app) {
  // Course API endpoints
  app.get('/api/courses', (req, res) => {
    // Mock data - would be replaced with database queries
    res.json([
      { 
        id: '1', 
        title: 'Islamic Studies 101', 
        description: 'Introduction to Islamic studies',
        imageUrl: '/public/placeholder.svg'
      },
      { 
        id: '2', 
        title: 'Arabic Language', 
        description: 'Learn Arabic fundamentals',
        imageUrl: '/public/placeholder.svg'
      },
      { 
        id: '3', 
        title: 'Quran Recitation', 
        description: 'Proper techniques for Quran recitation',
        imageUrl: '/public/placeholder.svg'
      },
    ]);
  });

  app.get('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    // Mock data - would be replaced with database lookup
    const courses = {
      '1': { 
        id: '1', 
        title: 'Islamic Studies 101', 
        description: 'Introduction to Islamic studies',
        imageUrl: '/public/placeholder.svg',
        modules: [
          { id: 'm1', title: 'Introduction to Islam', lessons: 3 },
          { id: 'm2', title: 'The Five Pillars', lessons: 5 },
          { id: 'm3', title: 'Islamic History', lessons: 4 },
        ]
      },
      '2': { 
        id: '2', 
        title: 'Arabic Language', 
        description: 'Learn Arabic fundamentals',
        imageUrl: '/public/placeholder.svg',
        modules: [
          { id: 'm1', title: 'Arabic Alphabet', lessons: 4 },
          { id: 'm2', title: 'Basic Grammar', lessons: 6 },
          { id: 'm3', title: 'Conversation', lessons: 5 },
        ]
      },
      '3': { 
        id: '3', 
        title: 'Quran Recitation', 
        description: 'Proper techniques for Quran recitation',
        imageUrl: '/public/placeholder.svg',
        modules: [
          { id: 'm1', title: 'Tajweed Rules', lessons: 7 },
          { id: 'm2', title: 'Pronunciation', lessons: 5 },
          { id: 'm3', title: 'Practice Sessions', lessons: 4 },
        ]
      },
    };
    
    if (courses[courseId]) {
      res.json(courses[courseId]);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  });

  // Calendar API endpoints
  app.get('/api/calendar/events', (req, res) => {
    // Mock data - would be replaced with database queries
    res.json([
      { id: '1', title: 'Islamic Studies Lecture', date: '2023-06-15', type: 'lecture' },
      { id: '2', title: 'Arabic Assignment Due', date: '2023-06-18', type: 'assignment' },
      { id: '3', title: 'Quran Recitation Session', date: '2023-06-20', type: 'other' },
      { id: '4', title: 'Islamic History Exam', date: '2023-06-25', type: 'exam' },
    ]);
  });

  app.post('/api/calendar/events', (req, res) => {
    // In a real app, this would save to a database
    console.log('New calendar event:', req.body);
    res.json({ 
      id: Date.now().toString(), 
      ...req.body,
      status: 'created' 
    });
  });

  // H5P content API endpoints
  app.get('/api/h5p/content/:id', (req, res) => {
    const contentId = req.params.id;
    // Mock data - would be replaced with actual H5P content
    res.json({
      id: contentId,
      title: 'H5P Interactive Content',
      type: 'quiz',
      // Additional H5P content data would go here
    });
  });
};
`;
  
  fs.writeFileSync(apiRoutesPath, apiRoutesContent);
  console.log(`Created API routes at: ${apiRoutesPath}`);
  
  // Update simplified-app.js to use the new API routes
  const simplifiedAppPath = path.join(__dirname, 'simplified-app.js');
  if (fs.existsSync(simplifiedAppPath)) {
    let appContent = fs.readFileSync(simplifiedAppPath, 'utf8');
    
    // Check if the API routes are already imported
    if (!appContent.includes('require(\'./api-routes\')')) {
      // Find the line where Express app is created
      const appCreationLine = 'const app = express();';
      const apiRoutesImport = "\n// Import API routes\nconst apiRoutes = require('./api-routes');\n";
      
      // Find the position after middleware setup
      const middlewareEndPos = appContent.indexOf('app.use(express.json());') + 'app.use(express.json());'.length;
      
      // Insert API routes initialization after middleware setup
      const apiRoutesInit = "\n\n// Initialize API routes\napiRoutes(app);\n";
      
      // Update the content
      appContent = [
        appContent.slice(0, appContent.indexOf(appCreationLine) + appCreationLine.length),
        apiRoutesImport,
        appContent.slice(appContent.indexOf(appCreationLine) + appCreationLine.length, middlewareEndPos),
        apiRoutesInit,
        appContent.slice(middlewareEndPos)
      ].join('');
      
      fs.writeFileSync(simplifiedAppPath, appContent);
      console.log(`Updated ${simplifiedAppPath} with API routes integration`);
    } else {
      console.log(`API routes already integrated in ${simplifiedAppPath}`);
    }
  } else {
    console.log(`Warning: ${simplifiedAppPath} not found. Could not update with API routes.`);
  }
}

// Update React routes
function updateReactRoutes() {
  console.log('Updating React routes...');
  
  const simplifiedAppPath = path.join(__dirname, 'src', 'SimplifiedApp.tsx');
  if (fs.existsSync(simplifiedAppPath)) {
    let appContent = fs.readFileSync(simplifiedAppPath, 'utf8');
    
    // Check if the components are already imported
    if (!appContent.includes('import { EdXCourseList }')) {
      // Add imports for the new components
      const importStatements = "import { EdXCourseList } from '@/components/external';\nimport { CanvasCalendar } from '@/components/external';\nimport { H5PInteractive } from '@/components/external';\n";
      
      // Find the position after existing imports
      const importEndPos = appContent.lastIndexOf('import');
      const importEndLinePos = appContent.indexOf('\n', importEndPos) + 1;
      
      // Add new routes to the Routes component
      const routesStartPos = appContent.indexOf('<Routes>');
      const routesEndPos = appContent.indexOf('</Routes>');
      
      const newRoutes = "\n            <Route path=\"/courses\" element={<EdXCourseList />} />\n            <Route path=\"/calendar\" element={<CanvasCalendar />} />\n            <Route path=\"/interactive\" element={<H5PInteractive contentId=\"1\" contentType=\"quiz\" />} />\n          ";
      
      // Update the content
      appContent = [
        appContent.slice(0, importEndLinePos),
        importStatements,
        appContent.slice(importEndLinePos, routesEndPos),
        newRoutes,
        appContent.slice(routesEndPos)
      ].join('');
      
      fs.writeFileSync(simplifiedAppPath, appContent);
      console.log(`Updated ${simplifiedAppPath} with new routes`);
    } else {
      console.log(`Components already imported in ${simplifiedAppPath}`);
    }
  } else {
    console.log(`Warning: ${simplifiedAppPath} not found. Could not update React routes.`);
  }
}

// Create a showcase page for integrated components
function createShowcasePage() {
  console.log('Creating showcase page...');
  
  const showcasePath = path.join(__dirname, 'src', 'pages', 'ComponentShowcase.tsx');
  const showcaseContent = `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EdXCourseList } from '@/components/external';
import { CanvasCalendar } from '@/components/external';
import { H5PInteractive } from '@/components/external';

export default function ComponentShowcase() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Integrated Components Showcase</h1>
      
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Course Components</h2>
          <p className="mb-4">These components are adapted from the EdX platform:</p>
          <EdXCourseList />
        </TabsContent>
        
        <TabsContent value="calendar" className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Calendar Components</h2>
          <p className="mb-4">These components are adapted from the Canvas LMS:</p>
          <CanvasCalendar />
        </TabsContent>
        
        <TabsContent value="interactive" className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Interactive Content</h2>
          <p className="mb-4">These components are adapted from H5P:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <H5PInteractive contentId="1" contentType="quiz" />
            <H5PInteractive contentId="2" contentType="presentation" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
`;
  
  fs.writeFileSync(showcasePath, showcaseContent);
  console.log(`Created showcase page at: ${showcasePath}`);
  
  // Update routes to include the showcase page
  updateReactRoutes();
}

// Main function to run the integration
function runIntegration() {
  console.log('Starting frontend integration...');
  
  try {
    // Create necessary directories
    createDirectories();
    
    // Create index file for external components
    createIndexFile();
    
    // Create adapter components
    createAdapterComponents();
    
    // Create API service files
    createApiServices();
    
    // Update backend API endpoints
    updateBackendApi();
    
    // Create showcase page
    createShowcasePage();
    
    console.log('\nFrontend integration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit the component showcase: http://localhost:8080/showcase');
    console.log('3. Review and customize the integrated components as needed');
  } catch (error) {
    console.error('Error during integration:', error);
  }
}

// Run the integration if this script is executed directly
if (require.main === module) {
  runIntegration();
}

module.exports = {
  runIntegration,
  config,
};