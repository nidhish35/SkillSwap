"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Handshake, Sparkles, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Comment {
    userId: {
        _id: string;
        name: string;
        profilePicture?: string;
        email?: string;
        skillsOffered?: string[];
        skillsWanted?: string[];
    } | string;
    text: string;
    date: string;
}

interface Post {
    _id: string;
    title: string;
    description: string;
    skillsOffered: string[];
    skillsWanted: string[];
    likes: { userId: string }[];
    comments: Comment[];
    user: {
        _id: string;
        name: string;
        profilePicture?: string;
        email?: string;
        skillsOffered?: string[];
        skillsWanted?: string[];
    };
}

const BASE = "http://localhost:5001"; // replace with env var if needed

const Dashboard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<any>(null);
    const [newComment, setNewComment] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const navigate = useNavigate();

    const resolveProfileImage = (profilePicture?: string) => {
        if (!profilePicture) return "";
        const s = profilePicture.trim();
        if (/^https?:\/\//i.test(s)) return s;
        if (s.startsWith("/")) return `${BASE}${s}`;
        if (s.includes("uploads") || s.includes("profile-pictures")) {
            return `${BASE}/${s.replace(/^\/+/, "")}`;
        }
        return `${BASE}/uploads/profile-pictures/${encodeURIComponent(s)}`;
    };

    const getCommentUserName = (comment: Comment) => {
        if (!comment.userId) return "User";
        if (typeof comment.userId === "string") return "User";
        return comment.userId.name || "User";
    };

    // Authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get<{ user: any }>(
                    `${BASE}/api/auth/me`,
                    { withCredentials: true }
                );
                setUser(res.data.user);
            } catch (err) {
                navigate("/auth");
            }
        };
        checkAuth();
    }, []);

    // Fetch posts
    useEffect(() => {
        if (user) {
            const fetchPosts = async () => {
                try {
                    const res = await axios.get<Post[]>(`${BASE}/api/posts`, {
                        withCredentials: true,
                    });
                    setPosts(res.data);
                } catch (err) {
                    console.error("Error fetching posts:", err);
                }
            };
            fetchPosts();
        }
    }, [user]);

    const handleLike = async (postId: string) => {
        try {
            await axios.post(
                `${BASE}/api/posts/${postId}/like`,
                {},
                { withCredentials: true }
            );
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            likes: p.likes.some((l) => l.userId === user._id)
                                ? p.likes.filter((l) => l.userId !== user._id)
                                : [...p.likes, { userId: user._id }],
                        }
                        : p
                )
            );
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const handleAddComment = async (postId: string) => {
        if (!newComment.trim()) return;
        try {
            const res = await axios.post<Post>(
                `${BASE}/api/posts/${postId}/comment`,
                { text: newComment },
                { withCredentials: true }
            );
            setPosts((prev) =>
                prev.map((p) => (p._id === postId ? (res.data as Post) : p))
            );
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        No posts yet. 🚀 Start by creating one!
                    </p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <Card
                                key={post._id}
                                className="bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Header */}
                                <CardHeader
                                    className="flex items-center gap-4 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 p-4"
                                >
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div
                                                className="flex items-center cursor-pointer"
                                                onClick={() => setSelectedUser(post.user)}
                                            >
                                                <Avatar className="w-12 h-12 ring-2 ring-indigo-300">
                                                    <AvatarImage
                                                        src={resolveProfileImage(post.user?.profilePicture)}
                                                        alt={post.user?.name}
                                                    />
                                                    <AvatarFallback>
                                                        {post.user?.name?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col ml-2">
                                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                                        {post.title}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-500">
                                                        By {post.user?.name || "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                        </DialogTrigger>

                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    <VisuallyHidden>
                                                        {selectedUser?.name || "User Profile"}
                                                    </VisuallyHidden>
                                                </DialogTitle>
                                            </DialogHeader>

                                            {selectedUser && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="w-16 h-16 ring-2 ring-indigo-300">
                                                            <AvatarImage
                                                                src={resolveProfileImage(selectedUser.profilePicture)}
                                                                alt={selectedUser.name}
                                                            />
                                                            <AvatarFallback>
                                                                {selectedUser.name?.charAt(0) || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                                                            {selectedUser.email && (
                                                                <p className="text-gray-500">{selectedUser.email}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {selectedUser.skillsOffered?.length > 0 && (
                                                        <div>
                                                            <h3 className="text-gray-600 font-medium mb-1">Skills Offered</h3>
                                                            <div className="flex flex-wrap gap-2">
                                                                {selectedUser.skillsOffered.map((skill: string, idx: number) => (
                                                                    <Badge key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                                                                        {skill}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {selectedUser.skillsWanted?.length > 0 && (
                                                        <div>
                                                            <h3 className="text-gray-600 font-medium mb-1">Skills Wanted</h3>
                                                            <div className="flex flex-wrap gap-2">
                                                                {selectedUser.skillsWanted.map((skill: string, idx: number) => (
                                                                    <Badge key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
                                                                        {skill}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                {/* Body */}
                                <CardContent className="p-4">
                                    <p className="text-gray-700 mb-3">{post.description}</p>

                                    {/* Skills Offered */}
                                    {post.skillsOffered?.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Handshake className="w-4 h-4 text-blue-500" />
                                            {post.skillsOffered.map((skill, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md cursor-pointer hover:scale-105 transition-transform"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* Skills Wanted */}
                                    {post.skillsWanted?.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <Sparkles className="w-4 h-4 text-green-500" />
                                            {post.skillsWanted.map((skill, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-700 px-2 py-1 rounded-md cursor-pointer hover:scale-105 transition-transform"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* Like & Comment Buttons */}
                                    <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
                                        <Button
                                            variant="ghost"
                                            className="flex items-center gap-2 hover:text-red-500 transition-colors"
                                            onClick={() => handleLike(post._id)}
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-transform ${post.likes.some((l) => l.userId === user._id)
                                                        ? "fill-red-500 text-red-500 animate-pulse"
                                                        : "text-gray-500"
                                                    }`}
                                            />
                                            <span>{post.likes.length}</span>
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" className="flex items-center gap-2">
                                                    <MessageCircle className="w-5 h-5 text-gray-500" />
                                                    <span>{post.comments.length}</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>💬 Comments</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 max-h-80 overflow-y-auto">
                                                    {post.comments.length ? (
                                                        post.comments.map((c, idx) => (
                                                            <div key={idx} className="flex items-start gap-3">
                                                                <Avatar className="w-8 h-8 ring-1 ring-gray-300">
                                                                    <AvatarImage
                                                                        src={
                                                                            typeof c.userId === "object"
                                                                                ? resolveProfileImage(c.userId.profilePicture)
                                                                                : ""
                                                                        }
                                                                        alt={getCommentUserName(c)}
                                                                    />
                                                                    <AvatarFallback>{getCommentUserName(c).charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="bg-gray-100 rounded-lg p-2">
                                                                    <p className="text-sm font-medium text-gray-800">
                                                                        {getCommentUserName(c)}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">{c.text}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No comments yet.</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <Input
                                                        placeholder="Write a comment..."
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                    />
                                                    <Button onClick={() => handleAddComment(post._id)}>Send</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <BottomBar />
        </div>
    );
};

export default Dashboard;
