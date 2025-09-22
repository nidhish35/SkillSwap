import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomBar from "../components/BottomBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card";

const API_URL = "http://20.255.50.15:5001"; // your VM public IP


const NewPost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skillsOffered, setSkillsOffered] = useState("");
    const [skillsWanted, setSkillsWanted] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPost = {
            title,
            description,
            skillsOffered: skillsOffered.split(",").map((s) => s.trim()),
            skillsWanted: skillsWanted.split(",").map((s) => s.trim()),
        };

        try {
            await axios.post(`${API_URL}/api/posts`, newPost, {
                withCredentials: true,
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            {/* Main content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-3xl font-extrabold text-center text-indigo-700">
                            ✨ Create a New Post
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <Input
                                    placeholder="Enter a catchy title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <Textarea
                                    placeholder="Describe what you're offering or looking for..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skills You Can Offer
                                </label>
                                <Input
                                    placeholder="e.g. Web Development, Graphic Design"
                                    value={skillsOffered}
                                    onChange={(e) => setSkillsOffered(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skills You Want to Learn
                                </label>
                                <Input
                                    placeholder="e.g. Public Speaking, Marketing"
                                    value={skillsWanted}
                                    onChange={(e) => setSkillsWanted(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
                            >
                                🚀 Submit Post
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>

            {/* Sticky Bottom Bar */}
            <BottomBar />
        </div>
    );
};

export default NewPost;
