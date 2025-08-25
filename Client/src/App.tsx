import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Hero from "./pages/Hero";

function App() {
  const [page, setPage] = useState<"hero" | "register" | "login" | "profile">("hero");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      {/* Navigation - show only if not on Hero */}
      {page !== "hero" && (
        <div className="flex space-x-4 mb-10 bg-white rounded-full shadow-lg px-6 py-2">
          <button
            onClick={() => setPage("register")}
            className={`px-4 py-2 rounded-full font-semibold transition ${page === "register" ? "bg-indigo-500 text-white" : "text-gray-700"
              }`}
          >
            Register
          </button>
          <button
            onClick={() => setPage("login")}
            className={`px-4 py-2 rounded-full font-semibold transition ${page === "login" ? "bg-green-500 text-white" : "text-gray-700"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setPage("profile")}
            className={`px-4 py-2 rounded-full font-semibold transition ${page === "profile" ? "bg-pink-500 text-white" : "text-gray-700"
              }`}
          >
            Profile
          </button>
        </div>
      )}

      {/* Pages */}
      {page === "hero" && <Hero onGetStarted={() => setPage("register")} />}
      {page === "register" && <Register />}
      {page === "login" && <Login />}
      {page === "profile" && <Profile />}
    </div>
  );
}

export default App;
