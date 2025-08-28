import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Hero from "./pages/Hero";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </BrowserRouter>
  );
};

export default App;
export { App };