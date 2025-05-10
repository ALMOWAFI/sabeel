import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  Code, 
  FileText, 
  Play, 
  Save, 
  Download, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  List
} from 'lucide-react';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock content for the Jupyter Book
  const bookContent = {
    title: "أساسيات علوم الحديث",
    author: "د. عبدالله الأنصاري",
    chapters: [
      {
        title: "مقدمة في علوم الحديث",
        sections: [
          "تعريف علم الحديث",
          "أهمية علم الحديث",
          "نشأة علم الحديث"
        ]
      },
      {
        title: "أقسام الحديث",
        sections: [
          "الحديث الصحيح",
          "الحديث الحسن",
          "الحديث الضعيف"
        ]
      },
      {
        title: "رواة الحديث",
        sections: [
          "طبقات الرواة",
          "الجرح والتعديل",
          "كتب الرجال"
        ]
      },
      {
        title: "تخريج الحديث",
        sections: [
          "طرق التخريج",
          "كتب التخريج",
          "أمثلة تطبيقية"
        ]
      }
    ]
  };

  // Mock content for the current page
  const pageContent = [
    {
      type: 'heading',
      content: 'تعريف علم الحديث'
    },
    {
      type: 'text',
      content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.'
    },
    {
      type: 'text',
      content: 'ينقسم علم الحديث إلى قسمين رئيسيين:'
    },
    {
      type: 'list',
      items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ]
    },
    {
      type: 'heading',
      content: 'نشأة علم الحديث'
    },
    {
      type: 'text',
      content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.'
    },
    {
      type: 'code',
      language: 'python',
      content: `# مثال على استخدام مكتبة لتحليل سند الحديث
import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)

# تقييم الإسناد
rating = hadith_analyzer.evaluate_chain(chain)
print(f"تقييم الإسناد: {rating}")
`
    },
    {
      type: 'text',
      content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.'
    }
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">{bookContent.title}</h2>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="h-4 w-4 mr-1" />
            تنزيل
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Save className="h-4 w-4 mr-1" />
            حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTableOfContents && (
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">المحتويات</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTableOfContents(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {bookContent.chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm cursor-pointer hover:text-primary">
                    {chapter.title}
                  </div>
                  <ul className="space-y-1 pr-3 border-r text-sm">
                    {chapter.sections.map((section, sIndex) => (
                      <li 
                        key={sIndex} 
                        className={`cursor-pointer hover:text-primary ${
                          index === 0 && sIndex === 0 ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="code">الكود</TabsTrigger>
                  <TabsTrigger value="notebook">الدفتر التفاعلي</TabsTrigger>
                </TabsList>
                
                {!showTableOfContents && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(true)}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="content" className="mt-0 h-full">
              <div className="max-w-3xl mx-auto">
                {!showTableOfContents && (
                  <h1 className="text-2xl font-bold mb-6">{bookContent.title}</h1>
                )}
                
                {pageContent.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{block.content}</h2>;
                    case 'text':
                      return <p key={index} className="mb-4 leading-relaxed">{block.content}</p>;
                    case 'list':
                      return (
                        <ul key={index} className="list-disc pr-6 mb-4 space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case 'code':
                      return (
                        <div key={index} className="bg-gray-100 rounded-md p-4 mb-4 font-mono text-sm overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{block.language}</span>
                            <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                              <Play className="h-3 w-3 mr-1" />
                              تشغيل
                            </Button>
                          </div>
                          <pre>{block.content}</pre>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                  <span className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0 h-full">
              <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>تحليل_سند_الحديث.py</span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      تشغيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      حفظ
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="font-mono h-[calc(100%-3rem)] bg-white"
                  defaultValue={pageContent.find(block => block.type === 'code')?.content || ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notebook" className="mt-0 h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      خلية نص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="# تعريف علم الحديث

علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها."
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      خلية كود
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      <pre>{`import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        تشغيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      نتيجة التنفيذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-md p-3 font-mono text-sm">
                      <pre>{`['عبد الله بن يوسف', 'مالك', 'نافع', 'عبد الله بن عمر']
تقييم الإسناد: صحيح`}</pre>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="mx-1">
                    <Upload className="h-4 w-4 mr-1" />
                    إضافة خلية
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Save className="h-4 w-4 mr-1" />
                    حفظ الدفتر
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Play className="h-4 w-4 mr-1" />
                    تشغيل الكل
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  Code, 
  FileText, 
  Play, 
  Save, 
  Download, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  List
} from 'lucide-react';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock content for the Jupyter Book
  const bookContent = {
    title: "أساسيات علوم الحديث",
    author: "د. عبدالله الأنصاري",
    chapters: [
      {
        title: "مقدمة في علوم الحديث",
        sections: [
          "تعريف علم الحديث",
          "أهمية علم الحديث",
          "نشأة علم الحديث"
        ]
      },
      {
        title: "أقسام الحديث",
        sections: [
          "الحديث الصحيح",
          "الحديث الحسن",
          "الحديث الضعيف"
        ]
      },
      {
        title: "رواة الحديث",
        sections: [
          "طبقات الرواة",
          "الجرح والتعديل",
          "كتب الرجال"
        ]
      },
      {
        title: "تخريج الحديث",
        sections: [
          "طرق التخريج",
          "كتب التخريج",
          "أمثلة تطبيقية"
        ]
      }
    ]
  };

  // Mock content for the current page
  const pageContent = [
    {
      type: 'heading',
      content: 'تعريف علم الحديث'
    },
    {
      type: 'text',
      content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.'
    },
    {
      type: 'text',
      content: 'ينقسم علم الحديث إلى قسمين رئيسيين:'
    },
    {
      type: 'list',
      items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ]
    },
    {
      type: 'heading',
      content: 'نشأة علم الحديث'
    },
    {
      type: 'text',
      content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.'
    },
    {
      type: 'code',
      language: 'python',
      content: `# مثال على استخدام مكتبة لتحليل سند الحديث
import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)

# تقييم الإسناد
rating = hadith_analyzer.evaluate_chain(chain)
print(f"تقييم الإسناد: {rating}")
`
    },
    {
      type: 'text',
      content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.'
    }
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">{bookContent.title}</h2>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="h-4 w-4 mr-1" />
            تنزيل
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Save className="h-4 w-4 mr-1" />
            حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTableOfContents && (
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">المحتويات</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTableOfContents(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {bookContent.chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm cursor-pointer hover:text-primary">
                    {chapter.title}
                  </div>
                  <ul className="space-y-1 pr-3 border-r text-sm">
                    {chapter.sections.map((section, sIndex) => (
                      <li 
                        key={sIndex} 
                        className={`cursor-pointer hover:text-primary ${
                          index === 0 && sIndex === 0 ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="code">الكود</TabsTrigger>
                  <TabsTrigger value="notebook">الدفتر التفاعلي</TabsTrigger>
                </TabsList>
                
                {!showTableOfContents && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(true)}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="content" className="mt-0 h-full">
              <div className="max-w-3xl mx-auto">
                {!showTableOfContents && (
                  <h1 className="text-2xl font-bold mb-6">{bookContent.title}</h1>
                )}
                
                {pageContent.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{block.content}</h2>;
                    case 'text':
                      return <p key={index} className="mb-4 leading-relaxed">{block.content}</p>;
                    case 'list':
                      return (
                        <ul key={index} className="list-disc pr-6 mb-4 space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case 'code':
                      return (
                        <div key={index} className="bg-gray-100 rounded-md p-4 mb-4 font-mono text-sm overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{block.language}</span>
                            <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                              <Play className="h-3 w-3 mr-1" />
                              تشغيل
                            </Button>
                          </div>
                          <pre>{block.content}</pre>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                  <span className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0 h-full">
              <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>تحليل_سند_الحديث.py</span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      تشغيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      حفظ
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="font-mono h-[calc(100%-3rem)] bg-white"
                  defaultValue={pageContent.find(block => block.type === 'code')?.content || ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notebook" className="mt-0 h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      خلية نص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="# تعريف علم الحديث

علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها."
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      خلية كود
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      <pre>{`import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        تشغيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      نتيجة التنفيذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-md p-3 font-mono text-sm">
                      <pre>{`['عبد الله بن يوسف', 'مالك', 'نافع', 'عبد الله بن عمر']
تقييم الإسناد: صحيح`}</pre>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="mx-1">
                    <Upload className="h-4 w-4 mr-1" />
                    إضافة خلية
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Save className="h-4 w-4 mr-1" />
                    حفظ الدفتر
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Play className="h-4 w-4 mr-1" />
                    تشغيل الكل
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  Code, 
  FileText, 
  Play, 
  Save, 
  Download, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  List
} from 'lucide-react';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock content for the Jupyter Book
  const bookContent = {
    title: "أساسيات علوم الحديث",
    author: "د. عبدالله الأنصاري",
    chapters: [
      {
        title: "مقدمة في علوم الحديث",
        sections: [
          "تعريف علم الحديث",
          "أهمية علم الحديث",
          "نشأة علم الحديث"
        ]
      },
      {
        title: "أقسام الحديث",
        sections: [
          "الحديث الصحيح",
          "الحديث الحسن",
          "الحديث الضعيف"
        ]
      },
      {
        title: "رواة الحديث",
        sections: [
          "طبقات الرواة",
          "الجرح والتعديل",
          "كتب الرجال"
        ]
      },
      {
        title: "تخريج الحديث",
        sections: [
          "طرق التخريج",
          "كتب التخريج",
          "أمثلة تطبيقية"
        ]
      }
    ]
  };

  // Mock content for the current page
  const pageContent = [
    {
      type: 'heading',
      content: 'تعريف علم الحديث'
    },
    {
      type: 'text',
      content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.'
    },
    {
      type: 'text',
      content: 'ينقسم علم الحديث إلى قسمين رئيسيين:'
    },
    {
      type: 'list',
      items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ]
    },
    {
      type: 'heading',
      content: 'نشأة علم الحديث'
    },
    {
      type: 'text',
      content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.'
    },
    {
      type: 'code',
      language: 'python',
      content: `# مثال على استخدام مكتبة لتحليل سند الحديث
import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)

# تقييم الإسناد
rating = hadith_analyzer.evaluate_chain(chain)
print(f"تقييم الإسناد: {rating}")
`
    },
    {
      type: 'text',
      content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.'
    }
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">{bookContent.title}</h2>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="h-4 w-4 mr-1" />
            تنزيل
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Save className="h-4 w-4 mr-1" />
            حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTableOfContents && (
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">المحتويات</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTableOfContents(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {bookContent.chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm cursor-pointer hover:text-primary">
                    {chapter.title}
                  </div>
                  <ul className="space-y-1 pr-3 border-r text-sm">
                    {chapter.sections.map((section, sIndex) => (
                      <li 
                        key={sIndex} 
                        className={`cursor-pointer hover:text-primary ${
                          index === 0 && sIndex === 0 ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="code">الكود</TabsTrigger>
                  <TabsTrigger value="notebook">الدفتر التفاعلي</TabsTrigger>
                </TabsList>
                
                {!showTableOfContents && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(true)}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="content" className="mt-0 h-full">
              <div className="max-w-3xl mx-auto">
                {!showTableOfContents && (
                  <h1 className="text-2xl font-bold mb-6">{bookContent.title}</h1>
                )}
                
                {pageContent.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{block.content}</h2>;
                    case 'text':
                      return <p key={index} className="mb-4 leading-relaxed">{block.content}</p>;
                    case 'list':
                      return (
                        <ul key={index} className="list-disc pr-6 mb-4 space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case 'code':
                      return (
                        <div key={index} className="bg-gray-100 rounded-md p-4 mb-4 font-mono text-sm overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{block.language}</span>
                            <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                              <Play className="h-3 w-3 mr-1" />
                              تشغيل
                            </Button>
                          </div>
                          <pre>{block.content}</pre>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                  <span className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0 h-full">
              <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>تحليل_سند_الحديث.py</span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      تشغيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      حفظ
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="font-mono h-[calc(100%-3rem)] bg-white"
                  defaultValue={pageContent.find(block => block.type === 'code')?.content || ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notebook" className="mt-0 h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      خلية نص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="# تعريف علم الحديث

علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها."
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      خلية كود
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      <pre>{`import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        تشغيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      نتيجة التنفيذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-md p-3 font-mono text-sm">
                      <pre>{`['عبد الله بن يوسف', 'مالك', 'نافع', 'عبد الله بن عمر']
تقييم الإسناد: صحيح`}</pre>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="mx-1">
                    <Upload className="h-4 w-4 mr-1" />
                    إضافة خلية
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Save className="h-4 w-4 mr-1" />
                    حفظ الدفتر
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Play className="h-4 w-4 mr-1" />
                    تشغيل الكل
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  Code, 
  FileText, 
  Play, 
  Save, 
  Download, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  List
} from 'lucide-react';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock content for the Jupyter Book
  const bookContent = {
    title: "أساسيات علوم الحديث",
    author: "د. عبدالله الأنصاري",
    chapters: [
      {
        title: "مقدمة في علوم الحديث",
        sections: [
          "تعريف علم الحديث",
          "أهمية علم الحديث",
          "نشأة علم الحديث"
        ]
      },
      {
        title: "أقسام الحديث",
        sections: [
          "الحديث الصحيح",
          "الحديث الحسن",
          "الحديث الضعيف"
        ]
      },
      {
        title: "رواة الحديث",
        sections: [
          "طبقات الرواة",
          "الجرح والتعديل",
          "كتب الرجال"
        ]
      },
      {
        title: "تخريج الحديث",
        sections: [
          "طرق التخريج",
          "كتب التخريج",
          "أمثلة تطبيقية"
        ]
      }
    ]
  };

  // Mock content for the current page
  const pageContent = [
    {
      type: 'heading',
      content: 'تعريف علم الحديث'
    },
    {
      type: 'text',
      content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.'
    },
    {
      type: 'text',
      content: 'ينقسم علم الحديث إلى قسمين رئيسيين:'
    },
    {
      type: 'list',
      items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ]
    },
    {
      type: 'heading',
      content: 'نشأة علم الحديث'
    },
    {
      type: 'text',
      content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.'
    },
    {
      type: 'code',
      language: 'python',
      content: `# مثال على استخدام مكتبة لتحليل سند الحديث
import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)

# تقييم الإسناد
rating = hadith_analyzer.evaluate_chain(chain)
print(f"تقييم الإسناد: {rating}")
`
    },
    {
      type: 'text',
      content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.'
    }
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">{bookContent.title}</h2>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="h-4 w-4 mr-1" />
            تنزيل
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Save className="h-4 w-4 mr-1" />
            حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTableOfContents && (
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">المحتويات</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTableOfContents(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {bookContent.chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm cursor-pointer hover:text-primary">
                    {chapter.title}
                  </div>
                  <ul className="space-y-1 pr-3 border-r text-sm">
                    {chapter.sections.map((section, sIndex) => (
                      <li 
                        key={sIndex} 
                        className={`cursor-pointer hover:text-primary ${
                          index === 0 && sIndex === 0 ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="code">الكود</TabsTrigger>
                  <TabsTrigger value="notebook">الدفتر التفاعلي</TabsTrigger>
                </TabsList>
                
                {!showTableOfContents && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(true)}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="content" className="mt-0 h-full">
              <div className="max-w-3xl mx-auto">
                {!showTableOfContents && (
                  <h1 className="text-2xl font-bold mb-6">{bookContent.title}</h1>
                )}
                
                {pageContent.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{block.content}</h2>;
                    case 'text':
                      return <p key={index} className="mb-4 leading-relaxed">{block.content}</p>;
                    case 'list':
                      return (
                        <ul key={index} className="list-disc pr-6 mb-4 space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case 'code':
                      return (
                        <div key={index} className="bg-gray-100 rounded-md p-4 mb-4 font-mono text-sm overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{block.language}</span>
                            <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                              <Play className="h-3 w-3 mr-1" />
                              تشغيل
                            </Button>
                          </div>
                          <pre>{block.content}</pre>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                  <span className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0 h-full">
              <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>تحليل_سند_الحديث.py</span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      تشغيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      حفظ
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="font-mono h-[calc(100%-3rem)] bg-white"
                  defaultValue={pageContent.find(block => block.type === 'code')?.content || ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notebook" className="mt-0 h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      خلية نص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="# تعريف علم الحديث

علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها."
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      خلية كود
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      <pre>{`import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        تشغيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      نتيجة التنفيذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-md p-3 font-mono text-sm">
                      <pre>{`['عبد الله بن يوسف', 'مالك', 'نافع', 'عبد الله بن عمر']
تقييم الإسناد: صحيح`}</pre>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="mx-1">
                    <Upload className="h-4 w-4 mr-1" />
                    إضافة خلية
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Save className="h-4 w-4 mr-1" />
                    حفظ الدفتر
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Play className="h-4 w-4 mr-1" />
                    تشغيل الكل
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  Code, 
  FileText, 
  Play, 
  Save, 
  Download, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  List
} from 'lucide-react';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock content for the Jupyter Book
  const bookContent = {
    title: "أساسيات علوم الحديث",
    author: "د. عبدالله الأنصاري",
    chapters: [
      {
        title: "مقدمة في علوم الحديث",
        sections: [
          "تعريف علم الحديث",
          "أهمية علم الحديث",
          "نشأة علم الحديث"
        ]
      },
      {
        title: "أقسام الحديث",
        sections: [
          "الحديث الصحيح",
          "الحديث الحسن",
          "الحديث الضعيف"
        ]
      },
      {
        title: "رواة الحديث",
        sections: [
          "طبقات الرواة",
          "الجرح والتعديل",
          "كتب الرجال"
        ]
      },
      {
        title: "تخريج الحديث",
        sections: [
          "طرق التخريج",
          "كتب التخريج",
          "أمثلة تطبيقية"
        ]
      }
    ]
  };

  // Mock content for the current page
  const pageContent = [
    {
      type: 'heading',
      content: 'تعريف علم الحديث'
    },
    {
      type: 'text',
      content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.'
    },
    {
      type: 'text',
      content: 'ينقسم علم الحديث إلى قسمين رئيسيين:'
    },
    {
      type: 'list',
      items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ]
    },
    {
      type: 'heading',
      content: 'نشأة علم الحديث'
    },
    {
      type: 'text',
      content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.'
    },
    {
      type: 'code',
      language: 'python',
      content: `# مثال على استخدام مكتبة لتحليل سند الحديث
import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)

# تقييم الإسناد
rating = hadith_analyzer.evaluate_chain(chain)
print(f"تقييم الإسناد: {rating}")
`
    },
    {
      type: 'text',
      content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.'
    }
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">{bookContent.title}</h2>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="h-4 w-4 mr-1" />
            تنزيل
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Save className="h-4 w-4 mr-1" />
            حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTableOfContents && (
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">المحتويات</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTableOfContents(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {bookContent.chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm cursor-pointer hover:text-primary">
                    {chapter.title}
                  </div>
                  <ul className="space-y-1 pr-3 border-r text-sm">
                    {chapter.sections.map((section, sIndex) => (
                      <li 
                        key={sIndex} 
                        className={`cursor-pointer hover:text-primary ${
                          index === 0 && sIndex === 0 ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="code">الكود</TabsTrigger>
                  <TabsTrigger value="notebook">الدفتر التفاعلي</TabsTrigger>
                </TabsList>
                
                {!showTableOfContents && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(true)}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="content" className="mt-0 h-full">
              <div className="max-w-3xl mx-auto">
                {!showTableOfContents && (
                  <h1 className="text-2xl font-bold mb-6">{bookContent.title}</h1>
                )}
                
                {pageContent.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{block.content}</h2>;
                    case 'text':
                      return <p key={index} className="mb-4 leading-relaxed">{block.content}</p>;
                    case 'list':
                      return (
                        <ul key={index} className="list-disc pr-6 mb-4 space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case 'code':
                      return (
                        <div key={index} className="bg-gray-100 rounded-md p-4 mb-4 font-mono text-sm overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{block.language}</span>
                            <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                              <Play className="h-3 w-3 mr-1" />
                              تشغيل
                            </Button>
                          </div>
                          <pre>{block.content}</pre>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                  <span className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0 h-full">
              <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>تحليل_سند_الحديث.py</span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      تشغيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      حفظ
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="font-mono h-[calc(100%-3rem)] bg-white"
                  defaultValue={pageContent.find(block => block.type === 'code')?.content || ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notebook" className="mt-0 h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      خلية نص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="# تعريف علم الحديث

علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها."
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      خلية كود
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      <pre>{`import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        تشغيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      نتيجة التنفيذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-md p-3 font-mono text-sm">
                      <pre>{`['عبد الله بن يوسف', 'مالك', 'نافع', 'عبد الله بن عمر']
تقييم الإسناد: صحيح`}</pre>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="mx-1">
                    <Upload className="h-4 w-4 mr-1" />
                    إضافة خلية
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Save className="h-4 w-4 mr-1" />
                    حفظ الدفتر
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Play className="h-4 w-4 mr-1" />
                    تشغيل الكل
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  Code, 
  FileText, 
  Play, 
  Save, 
  Download, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  List
} from 'lucide-react';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Mock content for the Jupyter Book
  const bookContent = {
    title: "أساسيات علوم الحديث",
    author: "د. عبدالله الأنصاري",
    chapters: [
      {
        title: "مقدمة في علوم الحديث",
        sections: [
          "تعريف علم الحديث",
          "أهمية علم الحديث",
          "نشأة علم الحديث"
        ]
      },
      {
        title: "أقسام الحديث",
        sections: [
          "الحديث الصحيح",
          "الحديث الحسن",
          "الحديث الضعيف"
        ]
      },
      {
        title: "رواة الحديث",
        sections: [
          "طبقات الرواة",
          "الجرح والتعديل",
          "كتب الرجال"
        ]
      },
      {
        title: "تخريج الحديث",
        sections: [
          "طرق التخريج",
          "كتب التخريج",
          "أمثلة تطبيقية"
        ]
      }
    ]
  };

  // Mock content for the current page
  const pageContent = [
    {
      type: 'heading',
      content: 'تعريف علم الحديث'
    },
    {
      type: 'text',
      content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.'
    },
    {
      type: 'text',
      content: 'ينقسم علم الحديث إلى قسمين رئيسيين:'
    },
    {
      type: 'list',
      items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ]
    },
    {
      type: 'heading',
      content: 'نشأة علم الحديث'
    },
    {
      type: 'text',
      content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.'
    },
    {
      type: 'code',
      language: 'python',
      content: `# مثال على استخدام مكتبة لتحليل سند الحديث
import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)

# تقييم الإسناد
rating = hadith_analyzer.evaluate_chain(chain)
print(f"تقييم الإسناد: {rating}")
`
    },
    {
      type: 'text',
      content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.'
    }
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">{bookContent.title}</h2>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" className="text-white">
            <Download className="h-4 w-4 mr-1" />
            تنزيل
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Save className="h-4 w-4 mr-1" />
            حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTableOfContents && (
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">المحتويات</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTableOfContents(false)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {bookContent.chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm cursor-pointer hover:text-primary">
                    {chapter.title}
                  </div>
                  <ul className="space-y-1 pr-3 border-r text-sm">
                    {chapter.sections.map((section, sIndex) => (
                      <li 
                        key={sIndex} 
                        className={`cursor-pointer hover:text-primary ${
                          index === 0 && sIndex === 0 ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="code">الكود</TabsTrigger>
                  <TabsTrigger value="notebook">الدفتر التفاعلي</TabsTrigger>
                </TabsList>
                
                {!showTableOfContents && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(true)}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="content" className="mt-0 h-full">
              <div className="max-w-3xl mx-auto">
                {!showTableOfContents && (
                  <h1 className="text-2xl font-bold mb-6">{bookContent.title}</h1>
                )}
                
                {pageContent.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{block.content}</h2>;
                    case 'text':
                      return <p key={index} className="mb-4 leading-relaxed">{block.content}</p>;
                    case 'list':
                      return (
                        <ul key={index} className="list-disc pr-6 mb-4 space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case 'code':
                      return (
                        <div key={index} className="bg-gray-100 rounded-md p-4 mb-4 font-mono text-sm overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{block.language}</span>
                            <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                              <Play className="h-3 w-3 mr-1" />
                              تشغيل
                            </Button>
                          </div>
                          <pre>{block.content}</pre>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                  <span className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0 h-full">
              <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span>تحليل_سند_الحديث.py</span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      تشغيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      حفظ
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="font-mono h-[calc(100%-3rem)] bg-white"
                  defaultValue={pageContent.find(block => block.type === 'code')?.content || ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notebook" className="mt-0 h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      خلية نص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[100px]"
                      defaultValue="# تعريف علم الحديث

علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها."
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      خلية كود
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      <pre>{`import hadith_analyzer

# تحليل سند حديث
hadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"
chain = hadith_analyzer.extract_narrators(hadith)
print(chain)`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        تشغيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      نتيجة التنفيذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-md p-3 font-mono text-sm">
                      <pre>{`['عبد الله بن يوسف', 'مالك', 'نافع', 'عبد الله بن عمر']
تقييم الإسناد: صحيح`}</pre>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="mx-1">
                    <Upload className="h-4 w-4 mr-1" />
                    إضافة خلية
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Save className="h-4 w-4 mr-1" />
                    حفظ الدفتر
                  </Button>
                  <Button variant="outline" className="mx-1">
                    <Play className="h-4 w-4 mr-1" />
                    تشغيل الكل
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}