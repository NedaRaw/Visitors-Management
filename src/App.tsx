import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "@/lib/router";
import SiteHeader from "@/components/SiteHeader";
import HomePage from "@/pages/HomePage";
import RegistrationForm from "@/pages/RegistrationForm";
import SuccessPage from "@/pages/SuccessPage";
import VisitorLookup from "@/pages/VisitorLookup";
import SurveyPage from "@/pages/SurveyPage";
import EnquiryPage from "@/pages/EnquiryPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import type { Visitor } from "@/types/visitor";
import { Phone, Mail } from "lucide-react";
import { LAB_INFO } from "@/config/app.config";

function AppRoutes() {
  const { route, go } = useRouter();
  const { isAuthenticated } = useAuth();
  const [lastVisitor, setLastVisitor] = useState<Visitor | null>(null);
  const [lastQr, setLastQr] = useState<string>("");

  const handleRegistered = (visitor: Visitor, qrDataUrl: string) => {
    setLastVisitor(visitor);
    setLastQr(qrDataUrl);
    go("/success", { visitor: visitor.visitorId });
  };

  const renderRoute = () => {
    switch (route.name) {
      case "home":
        return (
          <HomePage
            onRegister={() => go("/register")}
            onSurvey={() => go("/survey")}
            onEnquiry={() => go("/enquiry")}
          />
        );
      case "register":
        return <RegistrationForm onRegistered={handleRegistered} />;
      case "success":
        if (!lastVisitor) {
          return <RegistrationForm onRegistered={handleRegistered} />;
        }
        return (
          <SuccessPage
            visitor={lastVisitor}
            qrDataUrl={lastQr}
            onRegisterAnother={() => go("/")}
          />
        );
      case "visitor":
        return (
          <VisitorLookup visitorId={route.visitorId} onHome={() => go("/")} />
        );
      case "survey":
        return <SurveyPage onHome={() => go("/")} />;
      case "enquiry":
        return <EnquiryPage onHome={() => go("/")} />;
      case "admin":
        return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
      default:
        return (
          <HomePage
            onRegister={() => go("/register")}
            onSurvey={() => go("/survey")}
            onEnquiry={() => go("/enquiry")}
          />
        );
    }
  };

  const showHeader = route.name !== "admin" || isAuthenticated;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {showHeader && (
        <SiteHeader
          onHomeClick={() => go("/")}
          onAdminClick={() => go("/admin")}
          onEnquiryClick={() => go("/enquiry")}
          onSurveyClick={() => go("/survey")}
        />
      )}
      <main className="animate-[fadeIn_0.25s_ease]">{renderRoute()}</main>
      <footer className="no-print bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <img src="/logo-lab.png" alt="Lab Logo" className="mb-4 h-12 w-auto object-contain" />
              <p className="text-sm text-slate-400">{LAB_INFO.name}</p>
              <p className="mt-1 text-xs text-slate-500">{LAB_INFO.tagline}</p>
              <p className="mt-2 text-xs text-slate-500">{LAB_INFO.accreditation}</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <Phone size={14} className="mt-0.5 shrink-0" />
                  <a href={`tel:${LAB_INFO.phone}`} className="hover:text-white">{LAB_INFO.phone}</a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 shrink-0" />
                  <a href={`mailto:${LAB_INFO.email}`} className="hover:text-white">{LAB_INFO.email}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">Address</h4>
              <p className="text-sm text-slate-400">{LAB_INFO.addressEn}</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">Hours</h4>
              <p className="text-sm text-slate-400">Sunday – Thursday</p>
              <p className="text-sm text-slate-400">8:00 AM – 4:00 PM</p>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
            {LAB_INFO.name} &middot; {LAB_INFO.operator} &middot; Secure & Confidential
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
