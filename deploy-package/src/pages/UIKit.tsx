import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar, Footer } from '@/components/layouts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Component display wrapper
const ComponentDisplay = ({ title, children, code }) => {
  const [showCode, setShowCode] = useState(false);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
            {showCode ? 'إخفاء الكود' : 'عرض الكود'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          {children}
        </div>
        
        {showCode && (
          <div className="p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm">
            <pre>{code}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UIKit = () => {
  return (
    <div className="min-h-screen bg-sabeel-light dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 text-sabeel-secondary dark:text-white">معرض مكونات Sabeel</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          مكتبة مرجعية للمكونات المستخدمة في مشروع سبيل
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          <Card className="h-fit lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle>فهرس المكونات</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <ul className="space-y-2">
                  <li><a href="#buttons" className="text-sabeel-primary hover:underline">الأزرار</a></li>
                  <li><a href="#inputs" className="text-sabeel-primary hover:underline">حقول الإدخال</a></li>
                  <li><a href="#cards" className="text-sabeel-primary hover:underline">البطاقات</a></li>
                  <li><a href="#dialogs" className="text-sabeel-primary hover:underline">مربعات الحوار</a></li>
                  <li><a href="#accordions" className="text-sabeel-primary hover:underline">القوائم المنسدلة</a></li>
                  <li><a href="#forms" className="text-sabeel-primary hover:underline">النماذج</a></li>
                  <li><a href="#tabs" className="text-sabeel-primary hover:underline">التبويبات</a></li>
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <div>
            <section id="buttons" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-sabeel-secondary dark:text-white border-b pb-2">الأزرار</h2>
              
              <ComponentDisplay 
                title="أنواع الأزرار" 
                code={`<Button>زر أساسي</Button>
<Button variant="secondary">زر ثانوي</Button>
<Button variant="outline">زر محدد</Button>
<Button variant="ghost">زر شبح</Button>
<Button variant="link">زر رابط</Button>
<Button variant="destructive">زر تحذيري</Button>`}
              >
                <div className="flex flex-wrap gap-4">
                  <Button>زر أساسي</Button>
                  <Button variant="secondary">زر ثانوي</Button>
                  <Button variant="outline">زر محدد</Button>
                  <Button variant="ghost">زر شبح</Button>
                  <Button variant="link">زر رابط</Button>
                  <Button variant="destructive">زر تحذيري</Button>
                </div>
              </ComponentDisplay>
              
              <ComponentDisplay 
                title="أحجام الأزرار" 
                code={`<Button size="sm">زر صغير</Button>
<Button size="default">زر متوسط</Button>
<Button size="lg">زر كبير</Button>
<Button size="icon" className="w-10 h-10">+</Button>`}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">زر صغير</Button>
                  <Button size="default">زر متوسط</Button>
                  <Button size="lg">زر كبير</Button>
                  <Button size="icon" className="w-10 h-10">+</Button>
                </div>
              </ComponentDisplay>
            </section>
            
            <section id="inputs" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-sabeel-secondary dark:text-white border-b pb-2">حقول الإدخال</h2>
              
              <ComponentDisplay 
                title="حقل نصي بسيط" 
                code={`<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">البريد الإلكتروني</Label>
  <Input type="email" id="email" placeholder="ادخل بريدك الإلكتروني" />
</div>`}
              >
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input type="email" id="email" placeholder="ادخل بريدك الإلكتروني" />
                </div>
              </ComponentDisplay>
              
              <ComponentDisplay 
                title="خانات الاختيار" 
                code={`<div className="flex items-center space-x-2 space-x-reverse">
  <Checkbox id="terms" />
  <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
</div>`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
                </div>
              </ComponentDisplay>
              
              <ComponentDisplay 
                title="أزرار الراديو" 
                code={`<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2 space-x-reverse">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">الخيار الأول</Label>
  </div>
  <div className="flex items-center space-x-2 space-x-reverse">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">الخيار الثاني</Label>
  </div>
</RadioGroup>`}
              >
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">الخيار الأول</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">الخيار الثاني</Label>
                  </div>
                </RadioGroup>
              </ComponentDisplay>
              
              <ComponentDisplay 
                title="قائمة منسدلة" 
                code={`<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="اختر منطقة" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="mecca">مكة المكرمة</SelectItem>
    <SelectItem value="medina">المدينة المنورة</SelectItem>
    <SelectItem value="riyadh">الرياض</SelectItem>
    <SelectItem value="jeddah">جدة</SelectItem>
  </SelectContent>
</Select>`}
              >
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر منطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mecca">مكة المكرمة</SelectItem>
                    <SelectItem value="medina">المدينة المنورة</SelectItem>
                    <SelectItem value="riyadh">الرياض</SelectItem>
                    <SelectItem value="jeddah">جدة</SelectItem>
                  </SelectContent>
                </Select>
              </ComponentDisplay>
            </section>
            
            <section id="dialogs" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-sabeel-secondary dark:text-white border-b pb-2">مربعات الحوار</h2>
              
              <ComponentDisplay 
                title="مربع حوار بسيط" 
                code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">فتح مربع الحوار</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>عنوان مربع الحوار</DialogTitle>
      <DialogDescription>
        هذا وصف لمربع الحوار، يمكن أن يحتوي على معلومات إضافية.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          الاسم
        </Label>
        <Input id="name" className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">حفظ التغييرات</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">فتح مربع الحوار</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>عنوان مربع الحوار</DialogTitle>
                      <DialogDescription>
                        هذا وصف لمربع الحوار، يمكن أن يحتوي على معلومات إضافية.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          الاسم
                        </Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">حفظ التغييرات</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ComponentDisplay>
            </section>
            
            <section id="accordions" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-sabeel-secondary dark:text-white border-b pb-2">القوائم المنسدلة</h2>
              
              <ComponentDisplay 
                title="أكورديون بسيط" 
                code={`<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>ما هو سبيل؟</AccordionTrigger>
    <AccordionContent>
      سبيل هو منصة معرفية إسلامية تقدم أدوات متطورة للبحث والاستكشاف في القرآن الكريم والحديث النبوي والمعارف الإسلامية.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>ما هي الميزات الرئيسية؟</AccordionTrigger>
    <AccordionContent>
      يقدم سبيل مستكشف القرآن، وأدوات البحث في الحديث، ومخططات معرفية، وواجهات للعلماء، والعديد من الأدوات المتطورة.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>ما هو سبيل؟</AccordionTrigger>
                    <AccordionContent>
                      سبيل هو منصة معرفية إسلامية تقدم أدوات متطورة للبحث والاستكشاف في القرآن الكريم والحديث النبوي والمعارف الإسلامية.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>ما هي الميزات الرئيسية؟</AccordionTrigger>
                    <AccordionContent>
                      يقدم سبيل مستكشف القرآن، وأدوات البحث في الحديث، ومخططات معرفية، وواجهات للعلماء، والعديد من الأدوات المتطورة.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ComponentDisplay>
            </section>
            
            <section id="tabs" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-sabeel-secondary dark:text-white border-b pb-2">التبويبات</h2>
              
              <ComponentDisplay 
                title="تبويبات بسيطة" 
                code={`<Tabs defaultValue="resources" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="resources">الموارد</TabsTrigger>
    <TabsTrigger value="scholars">العلماء</TabsTrigger>
    <TabsTrigger value="community">المجتمع</TabsTrigger>
  </TabsList>
  <TabsContent value="resources">محتوى قسم الموارد يظهر هنا.</TabsContent>
  <TabsContent value="scholars">محتوى قسم العلماء يظهر هنا.</TabsContent>
  <TabsContent value="community">محتوى قسم المجتمع يظهر هنا.</TabsContent>
</Tabs>`}
              >
                <Tabs defaultValue="resources" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resources">الموارد</TabsTrigger>
                    <TabsTrigger value="scholars">العلماء</TabsTrigger>
                    <TabsTrigger value="community">المجتمع</TabsTrigger>
                  </TabsList>
                  <TabsContent value="resources" className="p-4 border rounded-md">محتوى قسم الموارد يظهر هنا.</TabsContent>
                  <TabsContent value="scholars" className="p-4 border rounded-md">محتوى قسم العلماء يظهر هنا.</TabsContent>
                  <TabsContent value="community" className="p-4 border rounded-md">محتوى قسم المجتمع يظهر هنا.</TabsContent>
                </Tabs>
              </ComponentDisplay>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UIKit;
