import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("http://localhost:5001/api/auth/logout", {
            method: "POST",
            
        });
        navigate("/auth");
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">SkillSwap</h1>
            <div className="space-x-4">
                <Button variant="outline" onClick={() => navigate("/profile")}>Profile</Button>
                <Button variant="outline" onClick={() => navigate("/chat")}>Chat</Button>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
        </nav>
    );
};

export default Navbar;
