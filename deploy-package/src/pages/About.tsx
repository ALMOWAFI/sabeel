
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-sabeel-primary text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                  alt="سَبِيل - Sabeel Logo" 
                  className="h-24 md:h-32"
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">عن سبيل</h1>
              <p className="text-xl mb-6">
                منصة تجمع بين العلماء والتقنيين لتسخير الذكاء الاصطناعي في خدمة الإسلام والمسلمين
              </p>
              <div className="h-1 w-24 bg-sabeel-accent mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-sabeel-primary">قصتنا</h2>
              
              <div className="prose dark:prose-invert max-w-none text-lg">
                <p className="mb-6">
                  نشأ مشروع "سبيل" من إدراك عميق لأهمية التقنية في عصرنا الحالي، وضرورة مواكبة المسلمين للثورة التقنية الجديدة التي يشهدها العالم مع ظهور الذكاء الاصطناعي.
                </p>
                
                <p className="mb-6">
                  لقد رأينا كيف أن الغرب يستفيد من هذه التقنيات ويوجهها وفق رؤاه ومصالحه، بينما تتخلف أمتنا عن ركب التطور، مما يعرضها لمخاطر كبيرة على المستويين الفكري والعملي.
                </p>
                
                <p className="mb-6">
                  من هنا، كانت فكرة إنشاء منصة تجمع بين العلماء والمشايخ من جهة، والمتخصصين في التقنية والذكاء الاصطناعي من جهة أخرى، للعمل معًا على تطوير أدوات وحلول تقنية تخدم الإسلام والمسلمين، وتحافظ على هويتنا وقيمنا في عصر التحولات التقنية الكبرى.
                </p>
                
                <blockquote className="font-arabic text-xl border-r-4 border-sabeel-primary pr-4 my-8">
                  "لا نرضى أن يُقال لنا يوم القيامة: كان بين أيديكم طريق، ولم تمشوا فيه…"
                </blockquote>
                
                <p className="mb-6">
                  نؤمن في سبيل أن التقنية ليست شرًا مطلقًا نتجنبه، ولا خيرًا مطلقًا نتبعه دون وعي، بل هي أداة قوية يمكن توجيهها لخدمة ديننا وأمتنا إذا أحسنا فهمها واستخدامها.
                </p>
                
                <p>
                  ومن هنا بدأت رحلتنا، وما زالت مستمرة بعون الله، لبناء مستقبل تقني يخدم الإسلام والمسلمين، ويسهم في نهضة الأمة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-sabeel-light dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold mb-4 text-sabeel-primary">رؤيتنا</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  إحياء الأمة من خلال تمكين العلماء والدعاة والشباب بالثورة التقنية الجديدة، وبناء منظومة شرعية-تقنية تُحصّن الوعي وتُطلق الفعل الدعوي الحقيقي.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold mb-4 text-sabeel-primary">رسالتنا</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  تقديم أدوات وتقنيات حديثة تعمل تحت إشراف شرعي وعقلي رصين، لبناء محتوى دعوي مؤثر وآمن، يواكب العصر دون أن يذوب فيه.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-sabeel-primary">قيمنا</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-r-4 border-sabeel-primary pr-4 py-2">
                  <h3 className="text-xl font-semibold mb-2 text-sabeel-secondary dark:text-white">أمانة العلم</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    لا يُستخدم الذكاء الاصطناعي للفتوى إلا ضمن ضوابط واضحة ودقيقة
                  </p>
                </div>
                
                <div className="border-r-4 border-sabeel-primary pr-4 py-2">
                  <h3 className="text-xl font-semibold mb-2 text-sabeel-secondary dark:text-white">الشفافية</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    كل أداة توضح كيف تعمل، ما مصادرها، ومتى يجب الحذر منها
                  </p>
                </div>
                
                <div className="border-r-4 border-sabeel-primary pr-4 py-2">
                  <h3 className="text-xl font-semibold mb-2 text-sabeel-secondary dark:text-white">التكامل</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    المشايخ والتقنيون ليسوا في صراع، بل في شراكة مقدسة لخدمة الدين
                  </p>
                </div>
                
                <div className="border-r-4 border-sabeel-primary pr-4 py-2">
                  <h3 className="text-xl font-semibold mb-2 text-sabeel-secondary dark:text-white">خدمة الناس أولاً</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    كل أداة تُبنى لحاجة حقيقية، وليس لمجرد الإبهار التقني
                  </p>
                </div>
                
                <div className="border-r-4 border-sabeel-primary pr-4 py-2">
                  <h3 className="text-xl font-semibold mb-2 text-sabeel-secondary dark:text-white">الواقعية</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    لا وعود كاذبة… نبدأ بالقليل المؤثر لا بالكبير الفارغ
                  </p>
                </div>
                
                <div className="border-r-4 border-sabeel-primary pr-4 py-2">
                  <h3 className="text-xl font-semibold mb-2 text-sabeel-secondary dark:text-white">النية الخالصة</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    العمل لخدمة الإسلام والمسلمين، بعيدًا عن المصالح الشخصية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
