
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import PremiumIndicator from '@/components/PremiumIndicator';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عن سبيل', path: '/about' },
    { name: 'للمشايخ', path: '/for-scholars' },
    { name: 'للتقنيين', path: '/for-technologists' },
    { name: 'المجتمع', path: '/community' },
    { name: 'الموارد', path: '/resources' },
    { name: 'المنصة', path: '/dashboard' },
    { name: 'العرض المتكامل', path: '/integrated-showcase' },
    { name: 'العرض المتكامل', path: '/integrated-showcase' },
    { name: 'العرض المتكامل', path: '/integrated-showcase' },
    { name: 'العرض المتكامل', path: '/integrated-showcase' },
    { name: 'العرض المتكامل', path: '/integrated-showcase' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <div className="flex flex-col">
            <span className="font-arabic text-lg md:text-xl font-bold text-sabeel-primary">سَبِيل</span>
            <span className="text-sm md:text-md font-semibold whitespace-nowrap">Sabeel</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground" 
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-foreground">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-2 text-sm font-medium hover:text-sabeel-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <Button asChild variant="outline" className="ml-4 border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
            <Link to="/community">الإنضمام</Link>
          </Button>

          {/* Members Login Button */}
          <div className="flex items-center gap-2">
            <PremiumIndicator />
            <Button asChild variant="ghost" size="icon" className="ml-2 text-sabeel-secondary hover:bg-sabeel-primary/10">
              <Link to="/login" aria-label="تسجيل الدخول">
                <Lock size={18} />
              </Link>
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="ml-2" onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMobile && isOpen && (
          <div className="fixed inset-0 top-16 bg-background z-50 p-4">
            <nav className="flex flex-col space-y-4 text-right">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-3 text-lg font-medium border-b border-muted hover:text-sabeel-primary"
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                <Button asChild className="w-full mt-2 bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                  <Link to="/community" onClick={closeMenu}>الإنضمام</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-sabeel-primary text-sabeel-primary">
                  <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2">
                    <Lock size={16} /> منطقة الأعضاء
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
