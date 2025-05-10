/**
 * QuizQuestion.tsx
 * 
 * Component for rendering individual quiz questions in the Islamic knowledge quiz system
 */

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, ChevronRight } from 'lucide-react';

export interface QuestionProps {
  id: string;
  question: string;
  questionArabic?: string;
  options: Array<{
    id: string;
    text: string;
    textArabic?: string;
  }>;
  correctOptionId: string;
  explanation: string;
  explanationArabic?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sourceReference?: string;
  quranReference?: string;
  hadithReference?: string;
}

interface QuizQuestionProps {
  question: QuestionProps;
  onAnswer: (questionId: string, selectedOptionId: string, isCorrect: boolean) => void;
  currentIndex: number;
  totalQuestions: number;
  showArabic: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentIndex,
  totalQuestions,
  showArabic
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
  };
  
  const handleSubmit = () => {
    if (!selectedOption || isAnswered) return;
    
    const correct = selectedOption === question.correctOptionId;
    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(question.id, selectedOption, correct);
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            سؤال {currentIndex + 1} من {totalQuestions}
          </span>
          <span className="px-2 py-1 bg-muted rounded-full text-xs">
            {question.category} • {
              question.difficulty === 'beginner' ? 'مبتدئ' :
              question.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'
            }
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="text-xl font-medium text-right">
            {showArabic && question.questionArabic ? question.questionArabic : question.question}
          </div>
          
          <RadioGroup 
            value={selectedOption || ''} 
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 space-x-reverse rtl:space-x-reverse border rounded-lg p-3 cursor-pointer transition-colors
                  ${isAnswered && option.id === question.correctOptionId ? 'bg-green-50 border-green-200' : ''}
                  ${isAnswered && selectedOption === option.id && option.id !== question.correctOptionId ? 'bg-red-50 border-red-200' : ''}
                  ${!isAnswered && selectedOption === option.id ? 'border-primary' : 'border-input'}
                `}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex-1 text-right">
                  <Label htmlFor={option.id} className="text-base cursor-pointer">
                    {showArabic && option.textArabic ? option.textArabic : option.text}
                  </Label>
                </div>
                <RadioGroupItem value={option.id} id={option.id} disabled={isAnswered} />
                {isAnswered && option.id === question.correctOptionId && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
                {isAnswered && selectedOption === option.id && option.id !== question.correctOptionId && (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {isAnswered && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="font-medium mb-2 text-right">
                {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </div>
              <p className="text-right">
                {showArabic && question.explanationArabic ? question.explanationArabic : question.explanation}
              </p>
              
              {(question.quranReference || question.hadithReference || question.sourceReference) && (
                <div className="mt-2 text-sm text-muted-foreground text-right">
                  <strong>المصدر:</strong> {' '}
                  {question.quranReference && <span>القرآن: {question.quranReference}</span>}
                  {question.hadithReference && <span>الحديث: {question.hadithReference}</span>}
                  {question.sourceReference && <span>{question.sourceReference}</span>}
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            {!isAnswered ? (
              <Button onClick={handleSubmit} disabled={!selectedOption}>
                تحقق من الإجابة
              </Button>
            ) : (
              <Button>
                السؤال التالي <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
