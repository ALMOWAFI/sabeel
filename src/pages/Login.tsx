
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Rich Background with Islamic Geometric Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-sabeel-secondary bg-opacity-95"></div>
        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-sabeel-primary/30 to-sabeel-secondary/70"></div>
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-red-800 via-red-600 to-red-800"></div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-red-800 via-red-600 to-red-800"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full border border-sabeel-accent/20 opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-sabeel-accent/20 opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full border border-sabeel-accent/20 opacity-20"></div>
      
      {/* Arabic Calligraphy Border Elements */}
      <div className="absolute inset-x-0 top-3 h-6 flex items-center justify-center">
        <div className="text-sabeel-accent font-arabic text-lg tracking-wider opacity-90">
          بسم الله الرحمن الرحيم
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-3 h-6 flex items-center justify-center">
        <div className="text-sabeel-accent font-arabic text-lg tracking-wider opacity-90">
          العلم نور والجهل ظلام
        </div>
      </div>
      
      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10 w-full max-w-md px-6 py-8"
      >
        <div className="relative">
          {/* Golden geometric decorative corners */}
          <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-sabeel-accent opacity-80"></div>
          <div className="absolute -top-2 -right-2 w-10 h-10 border-t-2 border-r-2 border-sabeel-accent opacity-80"></div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-2 border-l-2 border-sabeel-accent opacity-80"></div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-sabeel-accent opacity-80"></div>
          
          {/* Content */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            {/* Golden Border */}
            <div className="absolute inset-0 border-2 border-sabeel-accent opacity-70 rounded-lg pointer-events-none"></div>
            
            {/* Background with subtle pattern */}
            <div className="bg-gradient-to-b from-sabeel-dark/90 to-sabeel-secondary/90 backdrop-blur-sm p-8 relative">
              <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5"></div>
              
              {/* Logo and Emblem */}
              <div className="flex flex-col items-center mb-8 relative">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-32 h-32 relative"
                >
                  {/* Glowing effect for the logo */}
                  <div className="absolute inset-0 rounded-full bg-sabeel-accent/20 blur-md"></div>
                  
                  {/* Logo frame with golden border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sabeel-accent to-yellow-600 p-[2px]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sabeel-dark to-sabeel-secondary flex items-center justify-center p-2">
                      <img 
                        src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                        alt="Islamic Emblem" 
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
                
                <h1 className="font-arabic text-4xl font-bold mt-6 mb-1 text-center bg-gradient-to-r from-sabeel-accent to-yellow-400 bg-clip-text text-transparent">منطقة الأعضاء</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-sabeel-accent/90 to-transparent rounded-full mb-3"></div>
                <div className="text-sm text-sabeel-light/80 text-center max-w-xs font-arabic">
                  هذه المنطقة مخصصة للأعضاء المصرح لهم فقط
                </div>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6 relative">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-sabeel-accent mb-2 text-right font-arabic">
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
                      className={`pl-10 pr-4 bg-sabeel-light/5 border-sabeel-light/20 focus:border-sabeel-accent text-sabeel-light placeholder:text-sabeel-light/40 ${loginError ? 'border-red-500' : ''}`}
                      required
                      dir="rtl"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-sabeel-light/70 hover:text-sabeel-accent"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {loginError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-400 text-right"
                    >
                      كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.
                    </motion.p>
                  )}
                  <p className="mt-2 text-xs text-sabeel-light/60 text-right">
                    <span className="font-bold">ملاحظة للأعضاء المصرح لهم:</span> تذكر أن تنهي كلمة المرور بـ <span className="font-mono text-sabeel-accent">101</span>
                  </p>
                </div>
                
                <div>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2.5 transition-all duration-300 ${
                      isLoading ? 'bg-sabeel-accent/50 cursor-wait' : 'bg-gradient-to-r from-sabeel-accent to-yellow-500 hover:from-yellow-600 hover:to-sabeel-accent'
                    } text-sabeel-dark font-bold text-base shadow-lg shadow-sabeel-accent/20`}
                  >
                    {isLoading ? 'جاري التحقق...' : 'دخول'}
                  </Button>
                </div>
              </form>
              
              {/* Decorative Islamic Pattern */}
              <div className="mt-8 flex justify-center opacity-70">
                <div className="h-8 w-full max-w-[240px]"
                  style={{ backgroundImage: "url('/pattern-divider.svg')" }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sabeel-light/40 text-xs z-10">
        جميع الحقوق محفوظة © سبيل {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Login;
