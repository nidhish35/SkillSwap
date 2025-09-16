import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import type { User, Message } from "../types";

const BASE = "http://localhost:5001";

const ChatPage: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ If user navigated here from a post (Dashboard → "Message" button)
    const recipientFromPost = (location.state as { recipient?: User })?.recipient || null;

    // ✅ Helper to extract JWT from cookie
    const getTokenFromCookie = () => {
        const match = document.cookie.match(/(^| )jwt=([^;]+)/);
        return match ? match[2] : null;
    };

    // ✅ Check authentication using cookie
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get<{ user: User }>(`${BASE}/api/auth/me`, {
                    withCredentials: true,
                });
                setUser(res.data.user);
            } catch (err) {
                console.error("Auth failed:", err);
                navigate("/auth");
            }
        };
        checkAuth();
    }, [navigate]);

    // ✅ Initialize Socket.IO with JWT auth
    useEffect(() => {
        if (!user) return;

        const token = getTokenFromCookie();
        if (!token) {
            console.error("❌ No JWT token found in cookies");
            return;
        }

        const s = io(BASE, {
            transports: ["websocket", "polling"],
            auth: { token }, // 👈 send token explicitly
        });

        s.on("connect", () => {
            console.log("✅ Connected to socket:", s.id);
        });

        // Receive private messages
        s.on("privateMessage", (msg: Message) => {
            if (selectedUser && (msg.from === selectedUser._id || msg.to === selectedUser._id)) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        // Update message status (delivered / seen)
        s.on("messageStatus", ({ id, status }: { id: string; status: string }) => {
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === id
                        ? { ...m, status: status as Message["status"] }
                        : m
                )
            );
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [user, selectedUser]);

    // ✅ Fetch conversation list
    useEffect(() => {
        if (!user) return;

        axios
            .get<User[]>(`${BASE}/api/messages/conversations`, {
                withCredentials: true,
            })
            .then((res) => {
                let convos = res.data;

                // If opened with a recipient (new chat), add them if not in list
                if (recipientFromPost && !convos.some((u) => u._id === recipientFromPost._id)) {
                    convos = [recipientFromPost, ...convos];
                }

                setConversations(convos);

                // Auto-select recipient if coming from post
                if (recipientFromPost) {
                    setSelectedUser(recipientFromPost);
                }
            })
            .catch((err) => console.error("Error fetching conversations:", err));
    }, [user, recipientFromPost]);

    // ✅ Fetch messages for selected user
    useEffect(() => {
        if (!selectedUser) return;

        axios
            .get<Message[]>(`${BASE}/api/messages/${selectedUser._id}`, {
                withCredentials: true,
            })
            .then((res) => setMessages(res.data))
            .catch((err) => console.error("Error fetching messages:", err));
    }, [selectedUser]);

    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <main className="flex-1 flex overflow-hidden">
                <ConversationList
                    conversations={conversations}
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                />
                {selectedUser && socket && (
                    <ChatWindow messages={messages} socket={socket} recipient={selectedUser} />
                )}
            </main>
            <BottomBar />
        </div>
    );
};

export default ChatPage;
