import { useState } from "react";
import API from "../utils/api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/register", { username, email, password });
            localStorage.setItem("token", (res.data as { token: string }).token);
            alert("🎉 Registered successfully!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Registration failed ❌");
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Create an Account</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition">
                    Sign Up
                </button>
            </form>
        </div>
    );
}
