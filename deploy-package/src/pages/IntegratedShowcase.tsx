import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import the integrated components
import { CanvasDashboard } from "@/components/external/CanvasLMSIntegration";
import { JupyterBookViewer } from "@/components/external/JupyterBookIntegration";
import { KnowledgeGraphViewer } from "@/components/external/KingraphIntegration";

export default function IntegratedShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">منصة سبيل للمعرفة الإسلامية</h1>
        <p className="text-gray-600 mb-8">
          تكامل أدوات التعلم والمعرفة الإسلامية في منصة واحدة
        </p>
        
        <Tabs defaultValue="canvas" className="space-y-6">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="canvas">نظام إدارة التعلم</TabsTrigger>
            <TabsTrigger value="jupyter">الكتب التفاعلية</TabsTrigger>
            <TabsTrigger value="kingraph">شبكة المعرفة الإسلامية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نظام إدارة التعلم الإسلامي</CardTitle>
                <CardDescription>
                  منصة متكاملة لإدارة المقررات الدراسية الإسلامية والواجبات والتقويم الأكاديمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CanvasDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jupyter" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>الكتب التفاعلية للعلوم الإسلامية</CardTitle>
                <CardDescription>
                  منصة للكتب التفاعلية التي تجمع بين النصوص الإسلامية والتحليل البرمجي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <JupyterBookViewer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kingraph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription>
                  استكشاف العلاقات بين العلوم الإسلامية والعلماء والكتب بطريقة بصرية تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraphViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">عن تكامل الأنظمة في منصة سبيل</h2>
          <p className="mb-4">
            تهدف منصة سبيل إلى توفير بيئة متكاملة للتعلم والبحث في العلوم الإسلامية من خلال دمج أفضل الأدوات التعليمية والبحثية في منصة واحدة:
          </p>
          <ul className="list-disc pr-6 space-y-2 mb-4">
            <li>
              <strong>نظام إدارة التعلم (Canvas LMS):</strong> يوفر بيئة تعليمية متكاملة للمقررات الإسلامية، مع دعم كامل للغة العربية والمحتوى الإسلامي.
            </li>
            <li>
              <strong>الكتب التفاعلية (Jupyter Book):</strong> تتيح إنشاء كتب ومراجع إسلامية تفاعلية تجمع بين النص والرموز والتحليلات البرمجية.
            </li>
            <li>
              <strong>شبكة المعرفة الإسلامية (Kingraph):</strong> تقدم تمثيلاً بصرياً للعلاقات بين مختلف العلوم الإسلامية والعلماء والكتب، مما يسهل فهم الترابط بينها.
            </li>
          </ul>
          <p>
            من خلال هذا التكامل، توفر منصة سبيل تجربة تعليمية وبحثية فريدة تجمع بين التراث الإسلامي والتقنيات الحديثة.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import the integrated components
import { CanvasDashboard } from "@/components/external/CanvasLMSIntegration";
import { JupyterBookViewer } from "@/components/external/JupyterBookIntegration";
import { KnowledgeGraphViewer } from "@/components/external/KingraphIntegration";

export default function IntegratedShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">منصة سبيل للمعرفة الإسلامية</h1>
        <p className="text-gray-600 mb-8">
          تكامل أدوات التعلم والمعرفة الإسلامية في منصة واحدة
        </p>
        
        <Tabs defaultValue="canvas" className="space-y-6">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="canvas">نظام إدارة التعلم</TabsTrigger>
            <TabsTrigger value="jupyter">الكتب التفاعلية</TabsTrigger>
            <TabsTrigger value="kingraph">شبكة المعرفة الإسلامية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نظام إدارة التعلم الإسلامي</CardTitle>
                <CardDescription>
                  منصة متكاملة لإدارة المقررات الدراسية الإسلامية والواجبات والتقويم الأكاديمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CanvasDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jupyter" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>الكتب التفاعلية للعلوم الإسلامية</CardTitle>
                <CardDescription>
                  منصة للكتب التفاعلية التي تجمع بين النصوص الإسلامية والتحليل البرمجي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <JupyterBookViewer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kingraph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription>
                  استكشاف العلاقات بين العلوم الإسلامية والعلماء والكتب بطريقة بصرية تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraphViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">عن تكامل الأنظمة في منصة سبيل</h2>
          <p className="mb-4">
            تهدف منصة سبيل إلى توفير بيئة متكاملة للتعلم والبحث في العلوم الإسلامية من خلال دمج أفضل الأدوات التعليمية والبحثية في منصة واحدة:
          </p>
          <ul className="list-disc pr-6 space-y-2 mb-4">
            <li>
              <strong>نظام إدارة التعلم (Canvas LMS):</strong> يوفر بيئة تعليمية متكاملة للمقررات الإسلامية، مع دعم كامل للغة العربية والمحتوى الإسلامي.
            </li>
            <li>
              <strong>الكتب التفاعلية (Jupyter Book):</strong> تتيح إنشاء كتب ومراجع إسلامية تفاعلية تجمع بين النص والرموز والتحليلات البرمجية.
            </li>
            <li>
              <strong>شبكة المعرفة الإسلامية (Kingraph):</strong> تقدم تمثيلاً بصرياً للعلاقات بين مختلف العلوم الإسلامية والعلماء والكتب، مما يسهل فهم الترابط بينها.
            </li>
          </ul>
          <p>
            من خلال هذا التكامل، توفر منصة سبيل تجربة تعليمية وبحثية فريدة تجمع بين التراث الإسلامي والتقنيات الحديثة.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import the integrated components
import { CanvasDashboard } from "@/components/external/CanvasLMSIntegration";
import { JupyterBookViewer } from "@/components/external/JupyterBookIntegration";
import { KnowledgeGraphViewer } from "@/components/external/KingraphIntegration";

export default function IntegratedShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">منصة سبيل للمعرفة الإسلامية</h1>
        <p className="text-gray-600 mb-8">
          تكامل أدوات التعلم والمعرفة الإسلامية في منصة واحدة
        </p>
        
        <Tabs defaultValue="canvas" className="space-y-6">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="canvas">نظام إدارة التعلم</TabsTrigger>
            <TabsTrigger value="jupyter">الكتب التفاعلية</TabsTrigger>
            <TabsTrigger value="kingraph">شبكة المعرفة الإسلامية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نظام إدارة التعلم الإسلامي</CardTitle>
                <CardDescription>
                  منصة متكاملة لإدارة المقررات الدراسية الإسلامية والواجبات والتقويم الأكاديمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CanvasDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jupyter" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>الكتب التفاعلية للعلوم الإسلامية</CardTitle>
                <CardDescription>
                  منصة للكتب التفاعلية التي تجمع بين النصوص الإسلامية والتحليل البرمجي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <JupyterBookViewer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kingraph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription>
                  استكشاف العلاقات بين العلوم الإسلامية والعلماء والكتب بطريقة بصرية تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraphViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">عن تكامل الأنظمة في منصة سبيل</h2>
          <p className="mb-4">
            تهدف منصة سبيل إلى توفير بيئة متكاملة للتعلم والبحث في العلوم الإسلامية من خلال دمج أفضل الأدوات التعليمية والبحثية في منصة واحدة:
          </p>
          <ul className="list-disc pr-6 space-y-2 mb-4">
            <li>
              <strong>نظام إدارة التعلم (Canvas LMS):</strong> يوفر بيئة تعليمية متكاملة للمقررات الإسلامية، مع دعم كامل للغة العربية والمحتوى الإسلامي.
            </li>
            <li>
              <strong>الكتب التفاعلية (Jupyter Book):</strong> تتيح إنشاء كتب ومراجع إسلامية تفاعلية تجمع بين النص والرموز والتحليلات البرمجية.
            </li>
            <li>
              <strong>شبكة المعرفة الإسلامية (Kingraph):</strong> تقدم تمثيلاً بصرياً للعلاقات بين مختلف العلوم الإسلامية والعلماء والكتب، مما يسهل فهم الترابط بينها.
            </li>
          </ul>
          <p>
            من خلال هذا التكامل، توفر منصة سبيل تجربة تعليمية وبحثية فريدة تجمع بين التراث الإسلامي والتقنيات الحديثة.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import the integrated components
import { CanvasDashboard } from "@/components/external/CanvasLMSIntegration";
import { JupyterBookViewer } from "@/components/external/JupyterBookIntegration";
import { KnowledgeGraphViewer } from "@/components/external/KingraphIntegration";

export default function IntegratedShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">منصة سبيل للمعرفة الإسلامية</h1>
        <p className="text-gray-600 mb-8">
          تكامل أدوات التعلم والمعرفة الإسلامية في منصة واحدة
        </p>
        
        <Tabs defaultValue="canvas" className="space-y-6">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="canvas">نظام إدارة التعلم</TabsTrigger>
            <TabsTrigger value="jupyter">الكتب التفاعلية</TabsTrigger>
            <TabsTrigger value="kingraph">شبكة المعرفة الإسلامية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نظام إدارة التعلم الإسلامي</CardTitle>
                <CardDescription>
                  منصة متكاملة لإدارة المقررات الدراسية الإسلامية والواجبات والتقويم الأكاديمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CanvasDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jupyter" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>الكتب التفاعلية للعلوم الإسلامية</CardTitle>
                <CardDescription>
                  منصة للكتب التفاعلية التي تجمع بين النصوص الإسلامية والتحليل البرمجي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <JupyterBookViewer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kingraph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription>
                  استكشاف العلاقات بين العلوم الإسلامية والعلماء والكتب بطريقة بصرية تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraphViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">عن تكامل الأنظمة في منصة سبيل</h2>
          <p className="mb-4">
            تهدف منصة سبيل إلى توفير بيئة متكاملة للتعلم والبحث في العلوم الإسلامية من خلال دمج أفضل الأدوات التعليمية والبحثية في منصة واحدة:
          </p>
          <ul className="list-disc pr-6 space-y-2 mb-4">
            <li>
              <strong>نظام إدارة التعلم (Canvas LMS):</strong> يوفر بيئة تعليمية متكاملة للمقررات الإسلامية، مع دعم كامل للغة العربية والمحتوى الإسلامي.
            </li>
            <li>
              <strong>الكتب التفاعلية (Jupyter Book):</strong> تتيح إنشاء كتب ومراجع إسلامية تفاعلية تجمع بين النص والرموز والتحليلات البرمجية.
            </li>
            <li>
              <strong>شبكة المعرفة الإسلامية (Kingraph):</strong> تقدم تمثيلاً بصرياً للعلاقات بين مختلف العلوم الإسلامية والعلماء والكتب، مما يسهل فهم الترابط بينها.
            </li>
          </ul>
          <p>
            من خلال هذا التكامل، توفر منصة سبيل تجربة تعليمية وبحثية فريدة تجمع بين التراث الإسلامي والتقنيات الحديثة.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import the integrated components
import { CanvasDashboard } from "@/components/external/CanvasLMSIntegration";
import { JupyterBookViewer } from "@/components/external/JupyterBookIntegration";
import { KnowledgeGraphViewer } from "@/components/external/KingraphIntegration";

export default function IntegratedShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">منصة سبيل للمعرفة الإسلامية</h1>
        <p className="text-gray-600 mb-8">
          تكامل أدوات التعلم والمعرفة الإسلامية في منصة واحدة
        </p>
        
        <Tabs defaultValue="canvas" className="space-y-6">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="canvas">نظام إدارة التعلم</TabsTrigger>
            <TabsTrigger value="jupyter">الكتب التفاعلية</TabsTrigger>
            <TabsTrigger value="kingraph">شبكة المعرفة الإسلامية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نظام إدارة التعلم الإسلامي</CardTitle>
                <CardDescription>
                  منصة متكاملة لإدارة المقررات الدراسية الإسلامية والواجبات والتقويم الأكاديمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CanvasDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jupyter" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>الكتب التفاعلية للعلوم الإسلامية</CardTitle>
                <CardDescription>
                  منصة للكتب التفاعلية التي تجمع بين النصوص الإسلامية والتحليل البرمجي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <JupyterBookViewer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kingraph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription>
                  استكشاف العلاقات بين العلوم الإسلامية والعلماء والكتب بطريقة بصرية تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraphViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">عن تكامل الأنظمة في منصة سبيل</h2>
          <p className="mb-4">
            تهدف منصة سبيل إلى توفير بيئة متكاملة للتعلم والبحث في العلوم الإسلامية من خلال دمج أفضل الأدوات التعليمية والبحثية في منصة واحدة:
          </p>
          <ul className="list-disc pr-6 space-y-2 mb-4">
            <li>
              <strong>نظام إدارة التعلم (Canvas LMS):</strong> يوفر بيئة تعليمية متكاملة للمقررات الإسلامية، مع دعم كامل للغة العربية والمحتوى الإسلامي.
            </li>
            <li>
              <strong>الكتب التفاعلية (Jupyter Book):</strong> تتيح إنشاء كتب ومراجع إسلامية تفاعلية تجمع بين النص والرموز والتحليلات البرمجية.
            </li>
            <li>
              <strong>شبكة المعرفة الإسلامية (Kingraph):</strong> تقدم تمثيلاً بصرياً للعلاقات بين مختلف العلوم الإسلامية والعلماء والكتب، مما يسهل فهم الترابط بينها.
            </li>
          </ul>
          <p>
            من خلال هذا التكامل، توفر منصة سبيل تجربة تعليمية وبحثية فريدة تجمع بين التراث الإسلامي والتقنيات الحديثة.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import the integrated components
import { CanvasDashboard } from "@/components/external/CanvasLMSIntegration";
import { JupyterBookViewer } from "@/components/external/JupyterBookIntegration";
import { KnowledgeGraphViewer } from "@/components/external/KingraphIntegration";

export default function IntegratedShowcase() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">منصة سبيل للمعرفة الإسلامية</h1>
        <p className="text-gray-600 mb-8">
          تكامل أدوات التعلم والمعرفة الإسلامية في منصة واحدة
        </p>
        
        <Tabs defaultValue="canvas" className="space-y-6">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="canvas">نظام إدارة التعلم</TabsTrigger>
            <TabsTrigger value="jupyter">الكتب التفاعلية</TabsTrigger>
            <TabsTrigger value="kingraph">شبكة المعرفة الإسلامية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نظام إدارة التعلم الإسلامي</CardTitle>
                <CardDescription>
                  منصة متكاملة لإدارة المقررات الدراسية الإسلامية والواجبات والتقويم الأكاديمي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CanvasDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jupyter" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>الكتب التفاعلية للعلوم الإسلامية</CardTitle>
                <CardDescription>
                  منصة للكتب التفاعلية التي تجمع بين النصوص الإسلامية والتحليل البرمجي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <JupyterBookViewer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kingraph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription>
                  استكشاف العلاقات بين العلوم الإسلامية والعلماء والكتب بطريقة بصرية تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeGraphViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-bold mb-4">عن تكامل الأنظمة في منصة سبيل</h2>
          <p className="mb-4">
            تهدف منصة سبيل إلى توفير بيئة متكاملة للتعلم والبحث في العلوم الإسلامية من خلال دمج أفضل الأدوات التعليمية والبحثية في منصة واحدة:
          </p>
          <ul className="list-disc pr-6 space-y-2 mb-4">
            <li>
              <strong>نظام إدارة التعلم (Canvas LMS):</strong> يوفر بيئة تعليمية متكاملة للمقررات الإسلامية، مع دعم كامل للغة العربية والمحتوى الإسلامي.
            </li>
            <li>
              <strong>الكتب التفاعلية (Jupyter Book):</strong> تتيح إنشاء كتب ومراجع إسلامية تفاعلية تجمع بين النص والرموز والتحليلات البرمجية.
            </li>
            <li>
              <strong>شبكة المعرفة الإسلامية (Kingraph):</strong> تقدم تمثيلاً بصرياً للعلاقات بين مختلف العلوم الإسلامية والعلماء والكتب، مما يسهل فهم الترابط بينها.
            </li>
          </ul>
          <p>
            من خلال هذا التكامل، توفر منصة سبيل تجربة تعليمية وبحثية فريدة تجمع بين التراث الإسلامي والتقنيات الحديثة.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}