
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const targetGroups = [
  {
    title: "للمشايخ والدعاة",
    description: "تعزيز قدرتكم في نشر العلم وتوظيف التقنية لخدمة الدعوة، مع الحفاظ على أصالة المحتوى",
    path: "/for-scholars",
    image: "/scholars.jpg"
  },
  {
    title: "للمتخصصين التقنيين",
    description: "توظيف مهاراتكم في التطوير والبرمجة والذكاء الاصطناعي لخدمة الإسلام والمسلمين",
    path: "/for-technologists",
    image: "/tech-experts.jpg"
  },
  {
    title: "للشباب المسلم",
    description: "تنمية مهاراتكم التقنية وتوجيهها لخدمة قضايا الأمة بطرق عملية ومؤثرة",
    path: "/for-youth",
    image: "/youth.jpg"
  }
];

const ForWho = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sabeel-primary">لمن هذا المشروع؟</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            يستهدف مشروع سبيل فئات مختلفة من المجتمع الإسلامي، كل منها له دور مهم في تحقيق رؤيتنا
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {targetGroups.map((group, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center p-4">
                  <span className="font-arabic text-3xl font-bold text-sabeel-primary dark:text-sabeel-accent">
                    {group.title}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">{group.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{group.description}</p>
                <Button asChild variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  <Link to={group.path}>المزيد</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWho;
