
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ServerOff, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { API_ENDPOINTS } from "@/lib/config";
import { UserPreferencesService } from "@/services/UserPreferencesService";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import ForScholars from "./pages/ForScholars";
import ForTechnologists from "./pages/ForTechnologists";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Members from "./pages/Members";
import Dashboard from "./pages/Dashboard";
import Portal from "./pages/Portal";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import IntegratedShowcase from "./pages/IntegratedShowcase";
import CollaborativeWorkspace from "./components/collaboration/CollaborativeWorkspace";
import IslamicAIVerifier from "./components/protection/IslamicAIVerifier";
import MessiriLLM from './components/scholars/MessiriLLM';

// Design System & Component Documentation
import DesignSystem from "./pages/DesignSystem";
import UIKit from "./pages/UIKit";
import ComponentShowcase from "./pages/ComponentShowcase";
import IntegratedDashboard from "./pages/IntegratedDashboard";
import AIEnhancedKnowledgeExplorer from "./components/AIEnhancedKnowledgeExplorer";
import SupabaseUserProfile from "./components/SupabaseUserProfile";
import IntegratedIslamicKnowledgeSystem from "./components/enhanced/IntegratedIslamicKnowledgeSystem";

// System context provider
import { createContext, useContext } from 'react';

// Define the system status context type
interface SystemContextType {
  apiConnected: boolean;
  apiStatus: 'healthy' | 'degraded' | 'unavailable' | 'checking';
  setApiConnected: (status: boolean) => void;
  setApiStatus: (status: 'healthy' | 'degraded' | 'unavailable' | 'checking') => void;
  checkApiConnection: () => Promise<void>;
}

// Create the system context with default values
const SystemContext = createContext<SystemContextType>({
  apiConnected: false,
  apiStatus: 'checking',
  setApiConnected: () => {},
  setApiStatus: () => {},
  checkApiConnection: async () => {}
});

// Hook to use the system context
export const useSystemStatus = () => useContext(SystemContext);

// Set up query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const { toast } = useToast();
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'degraded' | 'unavailable' | 'checking'>('checking');
  const [showConnectionAlert, setShowConnectionAlert] = useState<boolean>(false);
  
  // Function to check API connection
  const checkApiConnection = async () => {
    try {
      setApiStatus('checking');
      
      // Try to connect to the API health endpoint
      const response = await fetch(API_ENDPOINTS.HEALTH, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiStatus(data.status);
        setApiConnected(data.status === 'healthy');
        
        if (data.status === 'degraded') {
          setShowConnectionAlert(true);
          toast({
            variant: "default",
            title: "اتصال محدود بالخادم",
            description: "بعض وظائف النظام قد تكون محدودة"
          });
        } else if (data.status === 'healthy') {
          setShowConnectionAlert(false);
        }
      } else {
        throw new Error('API returned an error status');
      }
    } catch (error) {
      console.error('API connection check failed:', error);
      setApiConnected(false);
      setApiStatus('unavailable');
      setShowConnectionAlert(true);
      toast({
        variant: "destructive",
        title: "تعذر الاتصال بالخادم",
        description: "تأكد من تشغيل خادم API سبيل وإعادة المحاولة"
      });
    }
  };
  
  // Check connection on component mount
  useEffect(() => {
    checkApiConnection();
    
    // Set up periodic connection checks
    const interval = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Load user preferences using UserPreferencesService
  useEffect(() => {
    const loadAndApplyPreferences = async () => {
      try {
        // Get the UserPreferencesService instance
        const preferencesService = UserPreferencesService.getInstance();
        
        // Load preferences
        await preferencesService.getPreferences();
        
        // Apply all preferences
        preferencesService.applyTheme();
        preferencesService.applyLanguage();
        preferencesService.applyAccessibility();
        preferencesService.applyContentPreferences();
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    };
    
    loadAndApplyPreferences();
  }, []);

  return (
    <SystemContext.Provider value={{ 
      apiConnected, 
      apiStatus, 
      setApiConnected, 
      setApiStatus,
      checkApiConnection
    }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {/* API Connection Status Alert */}
          {showConnectionAlert && (
            <div className="fixed top-4 right-4 z-50 w-96 max-w-[90vw]">
              <Alert variant="destructive" className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                {apiStatus === 'unavailable' ? (
                  <ServerOff className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                <AlertTitle>
                  {apiStatus === 'unavailable' ? 'تعذر الاتصال بالخادم' : 'اتصال محدود'}
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>
                    {apiStatus === 'unavailable' 
                      ? 'لم نتمكن من الاتصال بخادم API سبيل. بعض وظائف النظام لن تعمل.' 
                      : 'اتصال محدود بخادم API سبيل. بعض الميزات قد لا تعمل كما هو متوقع.'}
                  </span>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowConnectionAlert(false)}
                    >
                      إغلاق
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={checkApiConnection}
                    >
                      إعادة الاتصال
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <BrowserRouter>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/for-scholars" element={<ForScholars />} />
              <Route path="/for-technologists" element={<ForTechnologists />} />
              <Route path="/community" element={<Community />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/integrated-dashboard" element={<IntegratedDashboard />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/members" element={<Members />} />
              <Route path="/collaborative-workspace" element={<CollaborativeWorkspace />} />
              <Route path="/secret-organization" element={<SecretOrganization />} />
              
              {/* AI Integration Routes */}
              <Route path="/ai-knowledge-explorer" element={<AIEnhancedKnowledgeExplorer />} />
              <Route path="/profile" element={<SupabaseUserProfile />} />
              <Route path="/islamic-ai-verifier" element={<IslamicAIVerifier />} />
              <Route path="/messiri-llm" element={<MessiriLLM />} />
              <Route path="/integrated-islamic-knowledge" element={<IntegratedIslamicKnowledgeSystem />} />
              
              {/* Design System & Component Documentation */}
              <Route path="/design-system" element={<DesignSystem />} />
              <Route path="/ui-kit" element={<UIKit />} />
              <Route path="/component-showcase" element={<ComponentShowcase />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SystemContext.Provider>
  );
};

export default App;
