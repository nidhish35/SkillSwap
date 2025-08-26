import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
    const [isRegister, setIsRegister] = useState(true);
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        skillsOffered: "",
        skillsWanted: "",
    });
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // Handle Register form change
    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    };

    // Handle Login form change
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    // Submit Register
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...registerForm,
                skillsOffered: registerForm.skillsOffered.split(",").map(s => s.trim()),
                skillsWanted: registerForm.skillsWanted.split(",").map(s => s.trim()),
            };

            const res = await axios.post(
                "http://localhost:5001/api/auth/register",
                payload,
                { withCredentials: true } // optional for cookies
            );

            alert("User registered successfully!");
            console.log(res.data);
            setIsRegister(false);
        } catch (err: any) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };


    // Submit Login
    // Inside Auth.tsx
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5001/api/auth/login",
                loginForm,
                { withCredentials: true } // important for cookies
            );

            // No localStorage, cookie is set by backend
            const data = res.data as { user: any };
            console.log(data.user);
            navigate("/dashboard"); // redirect after login
        } catch (err: any) {
            alert(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <div className="max-w-md mx-auto mt-20 p-6 shadow-lg rounded-lg">
            {isRegister ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">Register</h1>
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <Input placeholder="Name" name="name" value={registerForm.name} onChange={handleRegisterChange} />
                        <Input placeholder="Email" name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} />
                        <Input placeholder="Password" name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} />
                        <textarea
                            placeholder="Bio"
                            name="bio"
                            value={registerForm.bio}
                            onChange={handleRegisterChange}
                            className="w-full p-2 border rounded"
                        />
                        <Input placeholder="Skills Offered (comma separated)" name="skillsOffered" value={registerForm.skillsOffered} onChange={handleRegisterChange} />
                        <Input placeholder="Skills Wanted (comma separated)" name="skillsWanted" value={registerForm.skillsWanted} onChange={handleRegisterChange} />
                        <Button type="submit" className="w-full">Register</Button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsRegister(false)}
                        >
                            Login
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <Input placeholder="Email" name="email" type="email" value={loginForm.email} onChange={handleLoginChange} />
                        <Input placeholder="Password" name="password" type="password" value={loginForm.password} onChange={handleLoginChange} />
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsRegister(true)}
                        >
                            Register
                        </button>
                    </p>
                </>
            )}
        </div>
    );
};

export default Auth;
