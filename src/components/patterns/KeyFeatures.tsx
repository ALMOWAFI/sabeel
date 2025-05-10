
import React from 'react';
import { Book, Users, Code, Globe, Brain, Shield } from 'lucide-react';

const features = [
  {
    icon: <Book className="w-10 h-10 text-sabeel-primary" />,
    title: "إشراف علمي",
    description: "تطوير الأدوات بإشراف ودعم من العلماء والمشايخ، لضمان موافقتها للشريعة"
  },
  {
    icon: <Code className="w-10 h-10 text-sabeel-primary" />,
    title: "تقنية متقدمة",
    description: "استخدام أحدث تقنيات الذكاء الاصطناعي والبرمجة لبناء حلول فعالة"
  },
  {
    icon: <Users className="w-10 h-10 text-sabeel-primary" />,
    title: "تمكين المجتمع",
    description: "تدريب الشباب والدعاة على استخدام الأدوات التقنية في العمل الإسلامي"
  },
  {
    icon: <Shield className="w-10 h-10 text-sabeel-primary" />,
    title: "أمان وخصوصية",
    description: "حماية بيانات المستخدمين وضمان الخصوصية في جميع التطبيقات"
  },
  {
    icon: <Globe className="w-10 h-10 text-sabeel-primary" />,
    title: "رؤية عالمية",
    description: "تطوير حلول تقنية تخدم المسلمين في كافة أنحاء العالم بمختلف اللغات"
  },
  {
    icon: <Brain className="w-10 h-10 text-sabeel-primary" />,
    title: "فهم عميق",
    description: "فهم عميق للتحديات التقنية والفرص التي تتيحها للعمل الإسلامي"
  }
];

const KeyFeatures = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sabeel-primary">ركائز المشروع</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            نعمل على بناء منظومة متكاملة تجمع بين العلم الشرعي والتقنية الحديثة لخدمة الأمة
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-sabeel-light dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
