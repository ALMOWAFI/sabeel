import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// This is a placeholder component to demonstrate how the integrated components
// from the webfrontend folder would be displayed
export default function ComponentShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Integrated Components Showcase</h1>
        <p className="text-gray-600 mb-8">
          This page demonstrates components integrated from the webfrontend folder into the Sabeel project.
          The actual components will be available after running the integration script.
        </p>
        
        <Tabs defaultValue="courses">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Course Components</h2>
            <p className="mb-4">These components are adapted from the EdX platform:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholder for EdXCourseCard components */}
              {[1, 2, 3].map(id => (
                <Card key={id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Course Image</span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">Example Course {id}</h3>
                    <p className="text-sm text-gray-500 mt-2">This is a placeholder for an integrated course component.</p>
                    <div className="mt-4">
                      <Button variant="link" className="p-0 h-auto text-primary">
                        View Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Calendar Components</h2>
            <p className="mb-4">These components are adapted from the Canvas LMS:</p>
            
            <Card>
              <CardHeader>
                <CardTitle>Academic Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Placeholder for calendar events */}
                  {['Lecture', 'Assignment', 'Exam'].map((type, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 border rounded-md">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        {type.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">Example {type}</h4>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                        <p className="text-sm mt-1">This is a placeholder for a calendar event.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interactive" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Interactive Content</h2>
            <p className="mb-4">These components are adapted from H5P:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Placeholder for H5P interactive components */}
              {['Quiz', 'Presentation'].map((type, index) => (
                <div 
                  key={index}
                  className="h5p-placeholder bg-gray-100 p-6 rounded-md text-center h-64 flex flex-col items-center justify-center"
                >
                  <h3 className="text-lg font-semibold mb-2">H5P {type}</h3>
                  <p className="text-sm text-gray-500 mb-4">Content ID: {index + 1}</p>
                  <p className="text-sm">This is a placeholder for H5P content that would be loaded dynamically.</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Integration Instructions</h2>
          <p className="mb-2">To complete the integration of webfrontend components:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Run the integration script: <code>node integrate_frontend.js</code></li>
            <li>Start the development server: <code>npm run dev</code></li>
            <li>Visit this showcase page to see the actual integrated components</li>
          </ol>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}