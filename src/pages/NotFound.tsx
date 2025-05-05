
import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-sabeel-primary mb-8">404</h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          الصفحة غير موجودة
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-sabeel-primary hover:bg-sabeel-secondary text-white">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} /> الرئيسية
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
            <Link to="#" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft size={18} /> العودة
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
