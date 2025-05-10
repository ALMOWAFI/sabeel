
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative hero-pattern min-h-screen flex items-center overflow-hidden pt-16">
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center text-center">
        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-medium mb-6 max-w-2xl animate-fade-in-up delay-100 text-sabeel-secondary dark:text-sabeel-light">
          الطريق نحو تقنية تخدم الإسلام وأهله
        </p>
        
        {/* Arabic Quote */}
        <blockquote className="font-arabic text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200 italic text-sabeel-primary dark:text-sabeel-accent">
          "لا نرضى أن يُقال لنا يوم القيامة: كان بين أيديكم طريق، ولم تمشوا فيه…"
        </blockquote>
        
        {/* Description */}
        <p className="text-base md:text-lg mb-10 max-w-3xl animate-fade-in-up delay-300 text-gray-700 dark:text-gray-300">
          مشروع سبيل هو مبادرة تجمع بين العلماء والتقنيين لتسخير ثورة الذكاء الاصطناعي والتقنيات الحديثة في خدمة الدعوة الإسلامية والنهوض بالأمة.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
          <Button asChild className="bg-sabeel-primary hover:bg-sabeel-secondary text-white px-8 py-6 text-lg">
            <Link to="/about">تعرف على سبيل</Link>
          </Button>
          <Button asChild variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white px-8 py-6 text-lg">
            <Link to="/community" className="flex items-center gap-2">
              انضم إلينا <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
