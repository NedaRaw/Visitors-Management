import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "@/lib/router";
import SiteHeader from "@/components/SiteHeader";
import RegistrationForm from "@/pages/RegistrationForm";
import SuccessPage from "@/pages/SuccessPage";
import VisitorLookup from "@/pages/VisitorLookup";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import type { Visitor } from "@/types/visitor";

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
      case "admin":
        return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
      default:
        return <RegistrationForm onRegistered={handleRegistered} />;
    }
  };

  const showHeader = route.name !== "admin" || isAuthenticated;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {showHeader && (
        <SiteHeader
          onHomeClick={() => go("/")}
          onAdminClick={() => go("/admin")}
        />
      )}
      <main className="animate-[fadeIn_0.25s_ease]">{renderRoute()}</main>
      <footer className="no-print border-t border-slate-200/70 py-6 text-center text-xs text-slate-400 dark:border-slate-700/60">
        Najran Central Laboratory — Visitor Management &middot; National
        Water Company &middot; Secure & Confidential
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
