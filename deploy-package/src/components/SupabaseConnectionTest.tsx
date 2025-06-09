import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseConfig';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [supabaseInfo, setSupabaseInfo] = useState<any>(null);
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection...");
        // Using the hardcoded URL from our config file instead of accessing the protected property
        console.log("Supabase URL: https://rfvgoxqwydinxolckxup.supabase.co");
        
        // Test authentication
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`);
        }
        
        console.log("Auth status:", authData ? "Connected" : "Not connected");
        
        // Test database
        const { data: dbData, error: dbError } = await supabase
          .from('job_openings')
          .select('count')
          .limit(1);
          
        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }
        
        console.log("Database connection:", dbData ? "Working" : "No data");
        
        setSupabaseInfo({
          url: "https://rfvgoxqwydinxolckxup.supabase.co",
          auth: authData ? "Connected" : "Not connected", 
          db: dbData ? "Working" : "No data"
        });
        
        setStatus('success');
      } catch (error) {
        console.error("Supabase connection test failed:", error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supabase Connection Test</span>
          {status === 'loading' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
        <CardDescription>Testing connection to Supabase backend</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-2">Testing Supabase connection...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Connection successful</AlertTitle>
              <AlertDescription>Successfully connected to Supabase</AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Supabase URL:</span>
                <span>{supabaseInfo?.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Auth Status:</span>
                <span>{supabaseInfo?.auth}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Database:</span>
                <span>{supabaseInfo?.db}</span>
              </div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <Alert className="bg-red-50 text-red-800 border-red-200">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection failed</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Could not connect to Supabase: {errorMessage}</p>
              <p className="text-sm">
                Please check the Supabase URL and anon key in your configuration.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        This test attempts to connect to Supabase and check the job_openings table.
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTest;
