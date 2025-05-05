
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface SabeelChatbotProps {
  onClose: () => void;
}

const SabeelChatbot: React.FC<SabeelChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'مرحباً بك في مشروع سبيل! أنا هنا لمساعدتك ومعرفة المزيد عن كيف يمكنك المساهمة في المشروع. بماذا يمكنني مساعدتك؟', 
      timestamp: new Date() 
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate bot response based on user input
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: Message = {
        role: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getBotResponse = (userInput: string): string => {
    // Convert to lowercase and trim for easier matching
    const input = userInput.toLowerCase();

    // Check for keywords and return appropriate responses
    if (input.includes('مرحبا') || input.includes('السلام عليكم') || input.includes('أهلا')) {
      return 'وعليكم السلام ورحمة الله وبركاته! كيف يمكنني مساعدتك اليوم؟';
    } 
    else if (input.includes('مشاريع') || input.includes('فرص')) {
      return 'نعمل حاليًا على عدة مشاريع مثل مساعد الذاكرة للعلماء، ونظام كشف المحتوى المزيف، ومنصة ترجمة المحتوى الإسلامي. يمكنك استكشاف المزيد في قسم المشاريع في الصفحة.';
    }
    else if (input.includes('انضمام') || input.includes('مساهمة')) {
      return 'يمكنك الانضمام إلى فريقنا عن طريق ملء استمارة الانضمام في قسم "انضم إلينا". سنتواصل معك بعد مراجعة طلبك لمناقشة كيفية مساهمتك في المشروع.';
    }
    else if (input.includes('ذكاء اصطناعي') || input.includes('ai')) {
      return 'نعمل على تطوير نماذج ذكاء اصطناعي متوافقة مع القيم الإسلامية، مثل مساعد الذاكرة للعلماء وأداة فاروق للفتاوى. نحتاج إلى متخصصين في الذكاء الاصطناعي للمساعدة في هذه المشاريع.';
    }
    else if (input.includes('مهارات') || input.includes('خبرة')) {
      return 'نبحث عن متخصصين بمهارات متنوعة مثل: تطوير الويب والتطبيقات، الذكاء الاصطناعي ومعالجة اللغة الطبيعية، تصميم واجهات المستخدم، تحليل البيانات، وأمن المعلومات. إذا كانت لديك أي من هذه المهارات أو مهارات أخرى ذات صلة، فنحن نرحب بك.';
    }
    else if (input.includes('هدف') || input.includes('رؤية')) {
      return 'هدف مشروع سبيل هو توظيف التقنية والذكاء الاصطناعي في خدمة العلم الشرعي والمجتمع الإسلامي. نسعى لبناء أدوات تقنية تساعد المشايخ والدعاة، وتحمي المحتوى الإسلامي، وتسهل الوصول إلى المعرفة الشرعية.';
    }
    else if (input.includes('تطوع') || input.includes('العمل')) {
      return 'العمل في مشروع سبيل هو عمل تطوعي في الأساس، لكن هناك بعض المشاريع التي قد تتضمن مكافآت. الأهم هو المساهمة في خدمة الإسلام والمسلمين من خلال مهاراتك التقنية.';
    }
    else if (input.includes('تواصل') || input.includes('اتصال')) {
      return 'يمكنك التواصل معنا من خلال النموذج الموجود في صفحة "تواصل معنا" أو عبر البريد الإلكتروني info@sabeel.org أو متابعتنا على منصات التواصل الاجتماعي.';
    }
    else if (input.includes('شكرا') || input.includes('جزاك الله خيرا')) {
      return 'العفو، وجزاك الله خيراً أيضاً. هل يمكنني مساعدتك في أي شيء آخر؟';
    }
    else if (input.includes('github') || input.includes('كود')) {
      return 'يمكنك الاطلاع على كود المشاريع المفتوحة المصدر والمساهمة فيها من خلال منصة GitHub. الرابط متاح في قسم "مصادر للمطورين" أسفل الصفحة.';
    }
    else {
      return 'شكراً لتواصلك. إذا كان لديك المزيد من الأسئلة حول مشروع سبيل أو كيفية المساهمة، يمكنك سؤالي أو زيارة صفحة "تواصل معنا" للتحدث مع فريقنا مباشرة.';
    }
  };

  return (
    <div className="fixed bottom-24 left-6 w-80 md:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 bg-sabeel-primary text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-medium">مساعد سبيل</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-sabeel-secondary h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col gap-3 dir-rtl">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-sabeel-primary text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-lg rounded-bl-none max-w-[80%] shadow-sm">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-150"></div>
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-lg flex items-center gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="اكتب رسالتك..."
          className="flex-1 text-right"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          size="icon" 
          className="bg-sabeel-primary hover:bg-sabeel-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SabeelChatbot;
