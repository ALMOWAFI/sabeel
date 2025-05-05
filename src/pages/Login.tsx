
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Check, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setIsSuccess(true);
      
      // Shorter delay and direct navigation
      setTimeout(() => {
        setIsLoading(false);
        navigate('/members');
      }, 1000);
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
      setIsSuccess(true);
      
      // Shorter delay and direct navigation
      setTimeout(() => {
        setIsLoading(false);
        navigate('/members');
      }, 1000);
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
      <motion.div 
        className="w-full max-w-md p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-6">
              <motion.img 
                src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                alt="Islamic Emblem" 
                className="w-20 h-20 object-contain mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
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
                    disabled={isSuccess}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isSuccess}
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
                disabled={isLoading || isSuccess}
                className={`w-full transition-all duration-300 ${
                  isSuccess ? 'bg-green-500 hover:bg-green-600' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    جاري التحقق...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center">
                    <Check className="h-5 w-5 mr-2" />
                    تم تسجيل الدخول
                  </span>
                ) : (
                  'دخول'
                )}
              </Button>
            </form>
            
            {/* Success Animation with immediate redirect confirmation */}
            {isSuccess && (
              <motion.div 
                className="mt-6 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ 
                    y: { repeat: Infinity, repeatType: "reverse", duration: 0.8 }
                  }}
                >
                  <div className="text-green-500 font-semibold mb-2">جاري تحويلك إلى لوحة التحكم</div>
                  <div className="w-8 h-8 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
