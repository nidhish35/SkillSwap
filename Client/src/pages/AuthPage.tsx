import { useState } from "react";
import API from "../utils/api";

type Page = "hero" | "auth" | "home";

export default function AuthPage({ setPage }: { setPage: React.Dispatch<React.SetStateAction<Page>> }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await API.post("/auth/login", { email, password });
            } else {
                await API.post("/auth/register", { username, email, password });
                alert("🎉 Registered successfully!");
            }
            setPage("home");
        } catch (err: any) {
            alert(err.response?.data?.message || "❌ Something went wrong");
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
            <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                {isLogin ? "Login" : "Register"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-indigo-600 font-semibold hover:underline"
                >
                    {isLogin ? "Register" : "Login"}
                </button>
            </p>
        </div>
    );
}
