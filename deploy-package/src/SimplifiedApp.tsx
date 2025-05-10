import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import ForScholars from "./pages/ForScholars";
import ForTechnologists from "./pages/ForTechnologists";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Members from "./pages/Members";
import Dashboard from "./pages/Dashboard";
import Portal from "./pages/Portal";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ComponentShowcase from "./pages/ComponentShowcase";

function SimplifiedApp() {
  return (
    <>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-scholars" element={<ForScholars />} />
            <Route path="/for-technologists" element={<ForTechnologists />} />
            <Route path="/community" element={<Community />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/members" element={<Members />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/showcase" element={<ComponentShowcase />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <Toaster />
    </>
  );
}

export default SimplifiedApp;