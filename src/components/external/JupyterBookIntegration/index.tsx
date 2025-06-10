import React, { useState, useEffect } from 'react';
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
import { jupyterBookService, BookContent, PageContentItem } from '@/services/JupyterBookService';

export function JupyterBookViewer() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [pageContent, setPageContent] = useState<PageContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPages = 5; // This could be dynamic if available from API

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      jupyterBookService.getBookContent(),
      jupyterBookService.getPageContent(currentPage)
    ]).then(([book, page]) => {
      setBookContent(book);
      setPageContent(page);
      setLoading(false);
    }).catch((e) => {
      setError('تعذر تحميل بيانات الكتاب.');
      setLoading(false);
    });
  }, [currentPage]);

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

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }
  if (!bookContent) {
    return <div className="flex justify-center items-center h-64 text-red-500">لا توجد بيانات كتاب</div>;
  }

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
                        className={`cursor-pointer hover:text-primary text-gray-600`}
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
                className="h-6 w-6 p-0"
              >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {pageContent.map((item, idx) => {
              if (item.type === 'heading') {
                return <h3 key={idx} className="text-xl font-bold mb-2">{item.content}</h3>;
              }
              if (item.type === 'text') {
                return <p key={idx} className="mb-2">{item.content}</p>;
              }
              if (item.type === 'list') {
                return <ul key={idx} className="list-disc pr-6 mb-2">{item.items && item.items.map((li, i) => <li key={i}>{li}</li>)}</ul>;
              }
              if (item.type === 'code') {
                return <pre key={idx} className="bg-gray-100 p-3 rounded mb-2 text-sm overflow-x-auto"><code>{item.content}</code></pre>;
              }
                      return null;
            })}
            <div className="flex justify-between mt-8">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>الصفحة السابقة</Button>
              <span>صفحة {currentPage} من {totalPages}</span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>الصفحة التالية</Button>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}