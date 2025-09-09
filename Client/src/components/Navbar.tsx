import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    // const handleLogout = async () => {
    //     await fetch("http://localhost:5001/api/auth/logout", {
    //         method: "POST",

    //     });
    //     navigate("/auth");
    // };
    const handleLogout = async () => {
        try {
            // Call the logout endpoint. This MUST include withCredentials.
            await axios.post(
                'http://localhost:5001/api/auth/logout',
                {}, // POST request needs a body, even if empty
                { withCredentials: true }
            );

            // Redirect to the login/auth page after successful logout
            navigate('/'); // Assuming your Auth component is at the root route
        } catch (err: any) {
            console.error("Logout failed", err);
            // Optionally, show an error message to the user
            alert(err.response?.data?.message || "Logout failed. Please try again.");
        }
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold" onClick={() => navigate("/dashboard")}>SkillSwap</h1>
            <div className="space-x-4">
                <Button variant="outline" onClick={() => navigate("/profile")}>Profile</Button>
                <Button variant="outline" onClick={() => navigate("/chat")}>Chat</Button>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
        </nav>
    );
};

export default Navbar;
