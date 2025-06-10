
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, AlertCircle, Book, RotateCcw, MessageSquare, // Added for chat bubble icon
UserCircle, // Added for user icon
Trash2 // Added for reset button icon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { API_ENDPOINTS } from "@/lib/config";

// Define message types for structured conversations
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: Source[];
  personalized_suggestions?: Suggestion[]; // Added for personalized suggestions
}

interface Source {
  title: string;
  url?: string;
  author?: string;
  citation?: string;
}

// Added interface for personalized suggestions
interface Suggestion {
  title: string;
  description: string;
  type: string; // e.g., 'learning_path_topic', 'related_question'
}

interface SabeelChatbotProps {
  onClose: () => void;
}

// Islamic knowledge context for the AI model
const ISLAMIC_CONTEXT = `
  أنت مساعد إسلامي متخصص يسمى "سبيل". تم تطويرك كجزء من مشروع سبيل لخدمة العلم الشرعي والمجتمع الإسلامي.
  
  التزم دائماً بما يلي:
  1. استند في إجاباتك على القرآن والسنة النبوية الصحيحة وإجماع العلماء المعتبرين
  2. لا تقدم فتاوى أو أحكام شرعية مباشرة، بل وجه السائل إلى المصادر الموثوقة والعلماء
  3. وضح إذا كان هناك اختلاف بين العلماء حول مسألة ما
  4. كن متوازناً في طرحك واحترم وجهات النظر المختلفة ضمن الإطار الإسلامي
  5. مهمتك الأساسية مساعدة المستخدمين على فهم الدين والتقنية معاً
  
  مشروع سبيل هو مبادرة لتسخير التقنيات الحديثة مثل الذكاء الاصطناعي لخدمة العلم الشرعي والدعوة الإسلامية، بقيادة علماء ومتخصصين مسلمين.
`;

// Create a unique ID for messages
const generateMessageId = () => Math.random().toString(36).substring(2, 15);

const SabeelChatbot: React.FC<SabeelChatbotProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateMessageId(),
      role: 'system',
      content: ISLAMIC_CONTEXT,
      timestamp: new Date()
    },
    {
      id: generateMessageId(),
      role: 'assistant',
      content: 'السلام عليكم ورحمة الله وبركاته! أنا مساعد سبيل، هنا لمساعدتك في فهم مشروع سبيل وكيفية توظيف التقنية في خدمة العلم الشرعي. كيف يمكنني خدمتك اليوم؟',
      timestamp: new Date(),
      sources: [] // Ensure sources is initialized for assistant messages
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Focus on input when chat opens
    inputRef.current?.focus();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setError(null);

    // Add user message
    const userMessageId = generateMessageId();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // In a production environment, this would be a call to an API
      const botResponse = await callVLLMApi(messages, userMessage);
      
      const botMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: botResponse.content,
        timestamp: new Date(),
        sources: botResponse.sources || [],
        personalized_suggestions: botResponse.personalized_suggestions || [] // Store suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error getting bot response:', err);
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
      toast({
        title: "خطأ في الاتصال",
        description: "لم نتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: generateMessageId(),
        role: 'system',
        content: ISLAMIC_CONTEXT,
        timestamp: new Date()
      },
      {
        id: generateMessageId(),
        role: 'assistant',
        content: 'السلام عليكم ورحمة الله وبركاته! أنا مساعد سبيل، هنا لمساعدتك في فهم مشروع سبيل وكيفية توظيف التقنية في خدمة العلم الشرعي. كيف يمكنني خدمتك اليوم؟',
        timestamp: new Date(),
        sources: [] // Ensure sources is initialized for assistant messages
      }
    ]);
    setError(null);
    toast({
      title: "تم إعادة تعيين المحادثة",
      description: "تم بدء محادثة جديدة"
    });
  };

  // Function to call the Islamic Knowledge API
  const callVLLMApi = async (existingMessages: Message[], newMessage: Message) => {
    try {
      // Get API URL from environment config
      const API_URL = API_ENDPOINTS.CHAT;
      
      // Get conversational context (exclude system messages from display)
      const displayMessages = existingMessages.filter(msg => msg.role !== 'system');
      
      // Format conversation history for the API
      const history = displayMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      // Prepare request data
      const requestData = {
        message: newMessage.content,
        history: history,
        madhab: localStorage.getItem('preferredMadhab') || null // Get user preference if set
      };
      
      // Call the API with 3 retries
      const MAX_RETRIES = 3;
      let retriesCount = 0;
      let apiError = null; // Renamed to avoid conflict with component's error state
      
      while (retriesCount < MAX_RETRIES) {
        try {
          // Make the API call
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
          
          // Check if response is successful
          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
          }
          
          // Parse response
          const data = await response.json();
          
          return {
            content: data.response || data.content || "لم أتمكن من فهم الرد.", // Ensure 'response' field is prioritized
            sources: data.sources?.valid || data.sources || [], // Adapt to new source structure if needed
            personalized_suggestions: data.personalized_suggestions || [] // Get suggestions
          };
        } catch (err) {
          // Store error and try again
          apiError = err;
          retriesCount += 1;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retriesCount)));
        }
      }
      
      // If we get here, all retries failed
      console.error('API call failed after retries:', apiError);
      
      // Fallback to basic responses if the API is completely down
      return getFallbackResponse(newMessage.content);
    } catch (err) {
      console.error('Error in API call logic:', err);
      return getFallbackResponse(newMessage.content);
    }
  };

  // Fallback function for when the API is unavailable
  const getFallbackResponse = (input: string) => {
    const inputLower = input.toLowerCase();
    let responseContent = ''; // Renamed to avoid conflict
    const responseSources: Source[] = []; // Renamed to avoid conflict
    
    // Basic fallback responses for critical queries
    if (inputLower.includes('سلام') || inputLower.includes('مرحبا') || inputLower.includes('أهلا')) {
      responseContent = 'وعليكم السلام ورحمة الله وبركاته! أهلاً بك. يبدو أن هناك مشكلة في الاتصال بنظام المعرفة الإسلامية. سأحاول مساعدتك بما أستطيع.';
    } else {
      responseContent = 'عذراً، يبدو أن هناك مشكلة في الاتصال بنظام المعرفة الإسلامية. يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بفريق الدعم الفني.';
    }
    
    return { content: responseContent, sources: responseSources, personalized_suggestions: [] };
  };

  // Placeholder function to handle suggestion clicks
  const handleSuggestionClick = (suggestionText: string) => {
    setInputMessage(suggestionText);
    toast({
      title: "تم نسخ الاقتراح إلى مربع الإدخال",
      description: `يمكنك تعديل "${suggestionText}" ثم إرساله.`
    });
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-24 left-6 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col z-50 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-slate-50 dark:bg-slate-800">
            <Bot className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">مساعد سبيل الإسلامي</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              <X className="h-5 w-5" />
            </Button>
      </div>
      
      {/* Messages container */}
      <ScrollArea className="flex-grow p-4 space-y-4 bg-white dark:bg-slate-900">
            {messages.filter(msg => msg.role !== 'system').map((message) => (
              <div
                key={message.id}
                className={`flex flex-col mb-3 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-md ${ 
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none dark:bg-slate-700 dark:text-slate-100'
                  }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center mb-1">
                      <Bot className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">مساعد سبيل</span>
                    </div>
                  )}
                  {message.role === 'user' && (
                    <div className="flex items-center mb-1 justify-end">
                      <span className="text-xs font-semibold text-blue-200 mr-2">أنت</span>
                      <UserCircle className="h-5 w-5 text-blue-200" />
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                      <h4 className="text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">المصادر:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {message.sources.map((source, i) => (
                          <li key={i} className="text-xs">
                            {source.url ? (
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">
                                {source.title}
                              </a>
                            ) : (
                              source.title
                            )}
                            {source.citation && <span className="ml-1 text-slate-400 dark:text-slate-500">({source.citation})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.personalized_suggestions && message.personalized_suggestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600">
                      <h4 className="text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">اقتراحات مخصصة لك:</h4>
                      <div className="space-y-1.5">
                        {message.personalized_suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion.title)}
                            className="w-full text-left p-2 rounded-md bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-800/70 transition-colors duration-150"
                          >
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">{suggestion.title}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{suggestion.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center p-3">
                <Spinner size="sm" className="mr-2" />
                <span className="text-sm text-slate-500 dark:text-slate-400">جاري التفكير...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
      {/* Input area */}
      <div className="p-4 border-t bg-slate-50 dark:bg-slate-800 flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={resetConversation} title="إعادة تعيين المحادثة" className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-500">
          <Trash2 className="h-5 w-5" />
        </Button>
        <Input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="اكتب رسالتك..."
          className="flex-1 text-right"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          size="icon" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SabeelChatbot;
