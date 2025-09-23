import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://skillswap.eastasia.cloudapp.azure.com:5001"; // your VM public IP


const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [avatarSrc, setAvatarSrc] = useState<string>("");

    // Resolve many possible stored formats for profilePicture
    const resolveProfileImage = (profilePicture?: string) => {
        if (!profilePicture) return "";

        const s = profilePicture.trim();

        // 1) Already a full URL (Google OAuth)
        if (/^https?:\/\//i.test(s)) return s;

        // 2) Absolute path from server: "/uploads/..." -> http://20.255.50.15:5001/uploads/...
        if (s.startsWith("/")) return `${API_URL}${s}`;

        // 3) If it already contains 'uploads' or 'profile-pictures' (e.g. "uploads/profile-pictures/abc.jpg" or "profile-pictures/abc.jpg")
        if (s.includes("uploads") || s.includes("profile-pictures")) {
            return `${API_URL}/${s.replace(/^\/+/, "")}`;
        }

        // 4) Otherwise assume it's just a filename stored by your uploader -> uploads/profile-pictures/<filename>
        return `${API_URL}/uploads/profile-pictures/${encodeURIComponent(s)}`;
    };

    // Fetch logged-in user (try both res.data.user and res.data)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auth/me`, {
                    withCredentials: true,
                });
                // log the response for debugging
                console.log("auth/me response:", res.data);

                // some APIs return { user: {...} }, some return the user object directly
                const data =
                    typeof res.data === "object" && res.data !== null && "user" in res.data
                        ? (res.data as { user: any }).user
                        : res.data;
                setUser(data ?? null);
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    // Update avatarSrc whenever user.profilePicture changes
    useEffect(() => {
        if (!user) {
            setAvatarSrc("");
            return;
        }
        setAvatarSrc(resolveProfileImage(user.profilePicture));
    }, [user?.profilePicture, user]);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            navigate("/"); // redirect after logout
        } catch (err: any) {
            console.error("Logout failed", err);
            alert(err?.response?.data?.message || "Logout failed. Try again.");
        }
    };

    const displayName =
        user?.name ?? user?.displayName ?? user?.email?.split?.("@")?.[0] ?? "Profile";
    const initial = (displayName && displayName.charAt(0)) || "U";

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1
                className="text-xl font-bold cursor-pointer"
                onClick={() => navigate("/dashboard")}
            >
                SkillSwap
            </h1>

            <div className="flex items-center space-x-4">
                {user ? (
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate("/profile")}
                    >
                        <Avatar className="w-8 h-8">
                            {/* AvatarImage will try avatarSrc; onError clears it so AvatarFallback shows */}
                            <AvatarImage
                                src={avatarSrc || undefined}
                                alt={displayName}
                                onError={() => {
                                    console.warn("Avatar image failed to load:", avatarSrc);
                                    setAvatarSrc("");
                                }}
                            />
                            <AvatarFallback>{initial}</AvatarFallback>
                        </Avatar>

                        <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
                    </div>
                ) : (
                    // optional: small sign-in button fallback
                    <Button variant="outline" onClick={() => navigate("/auth")}>
                        Sign in
                    </Button>
                )}

                <Button variant="outline" onClick={() => navigate("/chat")}>
                    Chat
                </Button>

                <Button variant="destructive" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
