import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
            <h1 className="text-5xl font-bold mb-6 text-center">Welcome to SkillSwap</h1>
            <p className="text-lg mb-8 text-center max-w-xl">
                Exchange skills, learn new things, and connect with experts. Teach what you know and learn what you want!
            </p>
            <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-blue-600 hover:bg-gray-100"
            >
                Get Started
            </Button>
        </div>
    );
};

export default Hero;
