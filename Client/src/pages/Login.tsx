import { useState } from "react";
import API from "../utils/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", { email, password });
            const data = res.data as { token: string };
            localStorage.setItem("token", data.token);
            alert("✅ Logged in successfully!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Login failed ❌");
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
            <h2 className="text-2xl font-bold mb-6 text-green-600">Welcome Back!</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                    Login
                </button>
            </form>
        </div>
    );
}
