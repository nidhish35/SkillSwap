import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Post from "./pages/NewPost";
import Settings from "./pages/Settings";
import ChatPage from "./pages/ChatPage";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />       {/* logged-in user */}
          <Route path="/profile/:userId" element={<Profile />} /> {/* other user */}
          <Route path="/post" element={<Post />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<ChatPage />} />{/* TODO: Create Settings page */}
        

        {/* Pass only route param, let ProfilePage read it */}
        {/* <Route path="/profile/:userId" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
