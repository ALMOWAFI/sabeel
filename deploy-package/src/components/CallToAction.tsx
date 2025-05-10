
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 bg-sabeel-light dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sabeel-primary dark:text-white">
            انضم إلى سبيل اليوم
          </h2>
          
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            كل منا له دور في هذه المسيرة. سواء كنت عالمًا، داعية، مطورًا، مصممًا، أو مهتمًا بالتقنية، انضم إلينا لنبني معًا مستقبلًا أفضل لأمتنا
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-sabeel-primary hover:bg-sabeel-secondary text-white px-8 py-6 text-lg">
              <Link to="/community">انضم للمجتمع</Link>
            </Button>
            
            <Button asChild variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white px-8 py-6 text-lg">
              <Link to="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
