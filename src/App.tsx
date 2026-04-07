import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Page from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ImageOptimizerPage from "./pages/Index-shrimg.tsx";
import QrCodePage from "./pages/Index-qrcode.tsx";
import PassGenPage from "./pages/Index-passgen.tsx";
import UrlScannerPage from "./pages/Index-urlscanner.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="image-optimizer" element={<ImageOptimizerPage />} />
            <Route path="qrcode" element={<QrCodePage />} />
            <Route path="passgen" element={<PassGenPage />} />
            <Route path="urlscanner" element={<UrlScannerPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
