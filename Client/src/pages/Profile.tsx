import { useEffect, useState } from "react";
import API from "../utils/api";

interface User {
    _id: string;
    username: string;
    email: string;
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await API.get("/auth/me");
                setUser(res.data as User);
            } catch {
                setUser(null);
            }
        };
        fetchMe();
    }, []);

    if (!user) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
                <h2 className="text-xl font-bold text-gray-700">Not logged in</h2>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
            <h2 className="text-2xl font-bold mb-6 text-pink-600">Your Profile</h2>
            <p className="mb-2"><b>Username:</b> {user.username}</p>
            <p className="mb-4"><b>Email:</b> {user.email}</p>
            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }}
                className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
            >
                Logout
            </button>
        </div>
    );
}
