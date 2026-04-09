import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Page from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ImageOptimizerPage from "./pages/IndexShrimg.tsx";
import QrCodePage from "./pages/IndexQrCode.tsx";
import PassGenPage from "./pages/IndexPassGen.tsx";
import UrlScannerPage from "./pages/IndexUrlScanner.tsx";
import WhoisPage from "./pages/IndexWhois.tsx";
import DashboardPage from "./pages/IndexDashboard.tsx";
import PassCheckPage from "./pages/IndexPassCheck.tsx";
import ColorConverterPage from "./pages/IndexColorConverter.tsx";
import BmiCalculatorPage from "./pages/IndexBmiCalculator.tsx";
import MetaTagReviewPage from "./pages/IndexMetaTagReview.tsx";
import Base64Page from "./pages/IndexBase64.tsx";
import HashGenPage from "./pages/IndexHashGen.tsx";
import UuidGenPage from "./pages/IndexUuidGen.tsx";
import JwtDecoderPage from "./pages/IndexJwtDecoder.tsx";
import PageSpeedPage from "./pages/IndexPageSpeed.tsx";
import DomainLookupPage from "./pages/IndexDomainLookup.tsx";
import TimestampPage from "./pages/IndexTimestamp.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route index element={<DashboardPage />} />
            <Route path="image-optimizer" element={<ImageOptimizerPage />} />
            <Route path="qrcode" element={<QrCodePage />} />
            <Route path="passgen" element={<PassGenPage />} />
            <Route path="urlscanner" element={<UrlScannerPage />} />
            <Route path="whois" element={<WhoisPage />} />
            <Route path="passcheck" element={<PassCheckPage />} />
            <Route path="color-converter" element={<ColorConverterPage />} />
            <Route path="bmi-calculator" element={<BmiCalculatorPage />} />
            <Route path="meta-tag-preview" element={<MetaTagReviewPage />} />
            <Route path="base64" element={<Base64Page />} />
            <Route path="hashgen" element={<HashGenPage />} />
            <Route path="uuidgen" element={<UuidGenPage />} />
            <Route path="jwtdecoder" element={<JwtDecoderPage />} />
            <Route path="pagespeed" element={<PageSpeedPage />} />
            <Route path="domainlookup" element={<DomainLookupPage />} />
            <Route path="timestamp" element={<TimestampPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
