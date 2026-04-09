import { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import DashboardPage from "./Dashboard";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { useAuth } from "./context/AuthContext";
import "./styles/index.css";

const GUEST_MODE_KEY = "frontpage-guest-mode";

export default function App() {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const [screen, setScreen] = useState("landing");

  const [guestMode, setGuestMode] = useState(() => {
    const saved = localStorage.getItem(GUEST_MODE_KEY);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(GUEST_MODE_KEY, String(guestMode));
  }, [guestMode]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-content">
          <h1>Loading Frontpage...</h1>
          <p>Restoring your session.</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardPage onExitGuest={() => setGuestMode(false)} />;
  }

  if (guestMode) {
    return (
      <DashboardPage
        onExitGuest={() => {
          localStorage.removeItem("frontpage-guest-mode");
          localStorage.removeItem("frontpage-view");
          localStorage.removeItem("frontpage-query");
          setGuestMode(false);
        }}
        goToHome={() => setGuestMode(false)}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginPage
        onBack={() => setScreen("landing")}
        onShowSignup={() => setScreen("signup")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupPage
        onBack={() => setScreen("landing")}
        onShowLogin={() => setScreen("login")}
      />
    );
  }

  return (
    <LandingPage
      onTryGuest={() => setGuestMode(true)}
      onShowLogin={() => setScreen("login")}
      onShowSignup={() => setScreen("signup")}
    />
  );
}