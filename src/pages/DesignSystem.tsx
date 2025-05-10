import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Navbar, Footer } from '@/components/layouts';

const DesignSystem = () => {
  return (
    <div className="min-h-screen bg-sabeel-light dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-sabeel-secondary dark:text-white">نظام التصميم Sabeel</h1>
        
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="colors">الألوان</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="buttons">الأزرار</TabsTrigger>
            <TabsTrigger value="inputs">الحقول</TabsTrigger>
            <TabsTrigger value="cards">البطاقات</TabsTrigger>
            <TabsTrigger value="components">المكونات</TabsTrigger>
          </TabsList>
          
          {/* Colors Section */}
          <TabsContent value="colors">
            <h2 className="text-2xl font-semibold mb-6 text-sabeel-secondary dark:text-white">الألوان الأساسية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ColorCard name="sabeel-primary" color="#10B981" textColor="white" />
              <ColorCard name="sabeel-secondary" color="#0F172A" textColor="white" />
              <ColorCard name="sabeel-accent" color="#6366F1" textColor="white" />
              <ColorCard name="sabeel-light" color="#F8FAFC" textColor="#0F172A" />
              <ColorCard name="sabeel-dark" color="#1E293B" textColor="white" />
            </div>
            
            <h2 className="text-2xl font-semibold my-6 text-sabeel-secondary dark:text-white">ألوان النص</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ColorCard name="gray-900" color="#101010" textColor="white" />
              <ColorCard name="gray-700" color="#374151" textColor="white" />
              <ColorCard name="gray-500" color="#6B7280" textColor="white" />
              <ColorCard name="gray-300" color="#D1D5DB" textColor="#374151" />
            </div>
          </TabsContent>
          
          {/* Typography Section */}
          <TabsContent value="typography">
            <h2 className="text-2xl font-semibold mb-6 text-sabeel-secondary dark:text-white">Typography</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Headings</CardTitle>
                <CardDescription>Font: "Noto Sans Arabic", sans-serif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold">العنوان الأول (H1) - 2.5rem</h1>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 700, Size: 2.5rem (40px)</div>
                </div>
                <Separator />
                <div>
                  <h2 className="text-3xl font-bold">العنوان الثاني (H2) - 2rem</h2>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 700, Size: 2rem (32px)</div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-2xl font-semibold">العنوان الثالث (H3) - 1.5rem</h3>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 600, Size: 1.5rem (24px)</div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xl font-semibold">العنوان الرابع (H4) - 1.25rem</h4>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 600, Size: 1.25rem (20px)</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Body Text</CardTitle>
                <CardDescription>Font: "Noto Sans Arabic", sans-serif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-base">النص الأساسي (Base) - هذا هو النص الأساسي للمحتوى العادي في الموقع. الحجم المستخدم هو 1rem (16px).</p>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 400, Size: 1rem (16px)</div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm">النص الصغير (Small) - يُستخدم للمعلومات الثانوية أو التعليقات الإضافية. الحجم المستخدم هو 0.875rem (14px).</p>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 400, Size: 0.875rem (14px)</div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs">النص الأصغر (Extra Small) - يُستخدم للملاحظات والتنبيهات الصغيرة. الحجم المستخدم هو 0.75rem (12px).</p>
                  <div className="text-sm text-gray-500 mt-1">Font weight: 400, Size: 0.75rem (12px)</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Buttons Section */}
          <TabsContent value="buttons">
            <h2 className="text-2xl font-semibold mb-6 text-sabeel-secondary dark:text-white">الأزرار</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>أنواع الأزرار</CardTitle>
                <CardDescription>تصميمات مختلفة للأزرار حسب الاستخدام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <Button>زر أساسي</Button>
                    <p className="text-sm mt-2">Primary</p>
                  </div>
                  <div className="text-center">
                    <Button variant="secondary">زر ثانوي</Button>
                    <p className="text-sm mt-2">Secondary</p>
                  </div>
                  <div className="text-center">
                    <Button variant="outline">زر محدد</Button>
                    <p className="text-sm mt-2">Outline</p>
                  </div>
                  <div className="text-center">
                    <Button variant="ghost">زر شبح</Button>
                    <p className="text-sm mt-2">Ghost</p>
                  </div>
                  <div className="text-center">
                    <Button variant="link">زر رابط</Button>
                    <p className="text-sm mt-2">Link</p>
                  </div>
                  <div className="text-center">
                    <Button variant="destructive">زر تحذيري</Button>
                    <p className="text-sm mt-2">Destructive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>أحجام الأزرار</CardTitle>
                <CardDescription>أحجام مختلفة للأزرار حسب الاستخدام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <Button size="sm">زر صغير</Button>
                    <p className="text-sm mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <Button size="default">زر متوسط</Button>
                    <p className="text-sm mt-2">Default</p>
                  </div>
                  <div className="text-center">
                    <Button size="lg">زر كبير</Button>
                    <p className="text-sm mt-2">Large</p>
                  </div>
                  <div className="text-center">
                    <Button size="icon" className="w-10 h-10">
                      <span className="sr-only">Icon button</span>
                      +
                    </Button>
                    <p className="text-sm mt-2">Icon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Inputs Section */}
          <TabsContent value="inputs">
            <h2 className="text-2xl font-semibold mb-6 text-sabeel-secondary dark:text-white">الحقول</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>حقول الإدخال</CardTitle>
                <CardDescription>حقول إدخال النص</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="text-input">ادخل نصًا</Label>
                  <Input id="text-input" placeholder="ادخل نصًا هنا..." />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="disabled-input">حقل معطل</Label>
                  <Input id="disabled-input" disabled placeholder="هذا الحقل معطل" />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="with-icon" className="flex items-center gap-2">
                    <span>البريد الإلكتروني</span>
                  </Label>
                  <Input id="with-icon" type="email" placeholder="ادخل بريدك الإلكتروني" />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>حقول الاختيار</CardTitle>
                  <CardDescription>Checkboxes and radios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
                  </div>
                  
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>مفاتيح التبديل</CardTitle>
                  <CardDescription>Switches and toggles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">وضع الطيران</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="notifications" defaultChecked />
                    <Label htmlFor="notifications">الإشعارات</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Cards Section */}
          <TabsContent value="cards">
            <h2 className="text-2xl font-semibold mb-6 text-sabeel-secondary dark:text-white">البطاقات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>بطاقة بسيطة</CardTitle>
                  <CardDescription>وصف للبطاقة البسيطة</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>محتوى البطاقة يظهر هنا. يمكن أن يحتوي على نص أو صور أو أي محتوى آخر.</p>
                </CardContent>
                <CardFooter>
                  <Button>زر عمل</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-sabeel-primary border-2">
                <CardHeader className="bg-sabeel-primary/5">
                  <CardTitle>بطاقة مميزة</CardTitle>
                  <CardDescription>بطاقة بإطار مميز</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>هذه البطاقة مميزة باستخدام إطار ملون وخلفية للعنوان.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">عمل ثانوي</Button>
                  <Button className="mr-2">عمل أساسي</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-sabeel-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-sabeel-accent text-lg">✦</span>
                  </div>
                  <CardTitle>بطاقة مع أيقونة</CardTitle>
                  <CardDescription>بطاقة تتضمن أيقونة في الأعلى</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>هذه البطاقة تتضمن أيقونة في الأعلى لتمييزها وجذب الانتباه.</p>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button variant="ghost">مزيد من المعلومات</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Components Section */}
          <TabsContent value="components">
            <h2 className="text-2xl font-semibold mb-6 text-sabeel-secondary dark:text-white">المكونات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>مكونات الواجهة</CardTitle>
                  <CardDescription>فهرس مكونات واجهة المستخدم المتاحة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Button - الأزرار</li>
                    <li>Input - حقول الإدخال</li>
                    <li>Card - البطاقات</li>
                    <li>Checkbox - خانات الاختيار</li>
                    <li>RadioGroup - أزرار الراديو</li>
                    <li>Select - القوائم المنسدلة</li>
                    <li>Switch - مفاتيح التبديل</li>
                    <li>Tabs - علامات التبويب</li>
                    <li>Dialog - مربعات الحوار</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">عرض مكتبة المكونات الكاملة</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>مكونات النمط</CardTitle>
                  <CardDescription>مكونات النمط المتكررة الاستخدام</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Hero - قسم البداية</li>
                    <li>CallToAction - حث على اتخاذ إجراء</li>
                    <li>ForWho - لمن هذا المحتوى</li>
                    <li>KeyFeatures - الميزات الرئيسية</li>
                    <li>Vision - الرؤية</li>
                    <li>ErrorBoundary - حدود معالجة الأخطاء</li>
                    <li>LanguageSwitcher - محول اللغة</li>
                    <li>NodeDetailPanel - لوحة تفاصيل العقدة</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">عرض جميع أنماط المكونات</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

// Color Card Component
const ColorCard = ({ name, color, textColor }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <div 
        className="h-24 flex items-center justify-center" 
        style={{ backgroundColor: color, color: textColor }}
      >
        <span className="text-lg font-medium">{name}</span>
      </div>
      <div className="p-3 bg-white dark:bg-gray-800 text-center">
        <p className="text-sm font-medium">{color}</p>
      </div>
    </div>
  );
};

export default DesignSystem;
