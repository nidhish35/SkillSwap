import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
}

const Dashboard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get<{ user: any }>("http://localhost:5001/api/auth/me", {
                    withCredentials: true, // send cookie
                });
                setUser(res.data.user);
            } catch (err) {
                // Not logged in → redirect to login
                navigate("/auth");
            }
        };
        checkAuth();
    }, []);
    if (!user) return <p>Loading...</p>;



    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             const res = await axios.get<Post[]>("http://localhost:5001/api/posts", {
    //                 // withCredentials: true, // send cookies
    //             });
    //             setPosts(res.data);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };

    //     fetchPosts();
    // }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <Card key={post._id} className="mb-4">
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{post.content}</p>
                                <p className="text-sm text-gray-400 mt-2">By: {post.author}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </main>
            <BottomBar />
        </div>
    );
};

export default Dashboard;
