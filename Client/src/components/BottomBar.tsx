"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Compass, PlusCircle, Settings } from "lucide-react";
import axios from "axios";

const API_URL = "http://20.255.50.15:5001"; // your VM public IP


const BottomBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);
    const [showExplorePopup, setShowExplorePopup] = useState(false);
    const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { name: "Home", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
        { name: "Explore", path: "/explore", icon: <Compass className="w-5 h-5" /> },
        { name: "Post", path: "/post", icon: <PlusCircle className="w-5 h-5" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
    ];

    const handleNavigate = (path: string) => {
        setActive(path);
        navigate(path);
        if (path !== "/explore") setShowExplorePopup(false);
    };

    // Fetch trending posts when popup opens
    useEffect(() => {
        if (showExplorePopup) {
            const fetchTrending = async () => {
                try {
                    const res = await axios.get(`${API_URL}/api/posts/trending`, {
                        withCredentials: true,
                    });
                    setTrendingPosts(res.data as any[]);
                } catch (err) {
                    console.error("Error fetching trending posts:", err);
                }
            };
            fetchTrending();
        }
    }, [showExplorePopup]);

    // Close popup if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowExplorePopup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-inner border-t border-gray-200 flex justify-around items-center py-2">
                {tabs.map((tab) => {
                    const isActive = active === tab.path;
                    return (
                        <div key={tab.name} className="relative">
                            <button
                                onClick={() => {
                                    if (tab.name === "Explore") {
                                        setShowExplorePopup(!showExplorePopup);
                                    } else {
                                        handleNavigate(tab.path);
                                    }
                                    setActive(tab.path);
                                }}
                                className={`
                    flex flex-col items-center justify-center text-sm transition-all duration-200 transform
                    ${isActive ? "text-indigo-600 font-semibold scale-105" : "text-gray-500"}
                    hover:scale-105 hover:shadow-md hover:bg-indigo-50 rounded-full px-3 py-1
                `}
                            >
                                <div className="p-1">{tab.icon}</div>
                                <span className="mt-1">{tab.name}</span>
                            </button>

                            {/* Explore Popup */}
                            {tab.name === "Explore" && showExplorePopup && (
                                <div
                                    ref={popupRef}
                                    className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-xl border border-gray-200 z-50 p-4"
                                >
                                    <h3 className="text-lg font-semibold mb-2">🔥 Trending Posts</h3>
                                    {trendingPosts.length > 0 ? (
                                        trendingPosts.map((post) => (
                                            <div
                                                key={post._id}
                                                onClick={() => {
                                                    navigate(`/post/${post._id}`);
                                                    setShowExplorePopup(false);
                                                }}
                                                className="p-2 rounded hover:bg-indigo-50 cursor-pointer"
                                            >
                                                <p className="font-medium">{post.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{post.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No trending posts yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default BottomBar;
