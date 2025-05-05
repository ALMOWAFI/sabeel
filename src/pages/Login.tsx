
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset error state when password changes
    if (loginError) setLoginError(false);
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if password ends with '101'
    if (password.endsWith('101')) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في منطقة الأعضاء",
        variant: "default",
      });
      // Set authentication state
      sessionStorage.setItem('member-authenticated', 'true');
      setIsLoading(false);
      navigate('/members');
    } else {
      setLoginError(true);
      toast({
        title: "فشل تسجيل الدخول",
        description: "كلمة المرور غير صحيحة",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-islamic-pattern">
      {/* Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-10 bg-repeat bg-[url('/pattern-bg.png')]"></div>
      
      {/* Decorative Border */}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 flex items-center justify-center">
        <div className="text-white text-xs font-arabic opacity-80 tracking-wider">
          بسم الله الرحمن الرحيم
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 flex items-center justify-center">
        <div className="text-white text-xs font-arabic opacity-80 tracking-wider">
          العلم نور والجهل ظلام
        </div>
      </div>
      
      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md px-8 py-10"
      >
        <div className={`relative rounded-2xl overflow-hidden ${loginError ? 'animate-shake' : ''}`}>
          {/* Golden Border */}
          <div className="absolute inset-0 border-4 border-sabeel-accent opacity-70 rounded-2xl pointer-events-none"></div>
          
          {/* Content */}
          <div className="bg-gradient-to-b from-sabeel-primary/95 to-sabeel-secondary/95 text-white p-8 backdrop-blur-sm">
            {/* Logo and Emblem */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-sabeel-accent to-yellow-500 flex items-center justify-center mb-3 p-1 shadow-lg">
                <img 
                  src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                  alt="Islamic Emblem" 
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h1 className="font-arabic text-3xl font-bold mt-4 text-center text-sabeel-accent">منطقة الأعضاء</h1>
              <div className="mt-2 text-sm text-sabeel-light/80 text-center max-w-xs">
                هذه المنطقة مخصصة للأعضاء المصرح لهم فقط
              </div>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-sabeel-light mb-1 text-right">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-sabeel-accent" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور الخاصة بك"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-4 bg-white/10 border-sabeel-light/20 focus:border-sabeel-accent text-sabeel-light placeholder:text-sabeel-light/50 ${loginError ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sabeel-light/70 hover:text-sabeel-accent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {loginError && (
                  <p className="mt-2 text-sm text-red-400 text-right">
                    كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.
                  </p>
                )}
                <p className="mt-2 text-xs text-sabeel-light/60 text-right">
                  <span className="font-bold">ملاحظة للأعضاء المصرح لهم:</span> تذكر أن تنهي كلمة المرور بـ <span className="font-mono">101</span>
                </p>
              </div>
              
              <div>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 transition-all duration-300 ${
                    isLoading ? 'bg-sabeel-primary/50' : 'bg-gradient-to-r from-sabeel-accent to-yellow-500 hover:from-yellow-500 hover:to-sabeel-accent'
                  } text-sabeel-secondary font-bold text-base`}
                >
                  {isLoading ? 'جاري التحقق...' : 'دخول'}
                </Button>
              </div>
            </form>
            
            {/* Decorative Islamic Pattern */}
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-full max-w-[240px] bg-contain bg-center bg-no-repeat opacity-30"
                style={{ backgroundImage: "url('/pattern-divider.svg')" }}>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-white/60 text-xs z-10">
        جميع الحقوق محفوظة © سبيل {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Login;
