
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for premium accounts (ending with 101)
    if (password.endsWith('101')) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في منطقة الأعضاء المميزين",
        variant: "default",
      });
      // Set premium authentication
      sessionStorage.setItem('member-authenticated', 'premium');
      setIsLoading(false);
      navigate('/members');
    } 
    // For regular members (any other password)
    else if (password.length >= 4) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في منطقة الأعضاء",
        variant: "default",
      });
      // Set regular authentication
      sessionStorage.setItem('member-authenticated', 'regular');
      setIsLoading(false);
      navigate('/members');
    } 
    // For invalid passwords
    else {
      toast({
        title: "فشل تسجيل الدخول",
        description: "كلمة المرور قصيرة جداً",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                alt="Islamic Emblem" 
                className="w-20 h-20 object-contain mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">منطقة الأعضاء</h1>
              <div className="text-sm text-gray-500 text-center">
                أدخل كلمة المرور للوصول
              </div>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-right"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  للأعضاء المميزين: يجب أن تنتهي كلمة المرور بـ 101
                </p>
              </div>
              
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'جاري التحقق...' : 'دخول'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
