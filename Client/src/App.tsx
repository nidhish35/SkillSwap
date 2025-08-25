import { useEffect, useState } from "react";
import Hero from "./pages/Hero";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import API from "./utils/api"; // your axios instance with withCredentials: true

type Page = "hero" | "auth" | "home";

export default function App() {
  const [page, setPage] = useState<Page>("hero");
  const [user, setUser] = useState<any>(null);

  // ✅ Check if user is already logged in on page load
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUser((res.data as { user: any }).user);
        setPage("home");
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    setPage("auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      {page === "hero" && <Hero onGetStarted={() => setPage("auth")} />}
      {page === "auth" && <AuthPage setPage={setPage} />}
      {page === "home" && (
        <Home user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
