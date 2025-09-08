import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// A simple SVG icon for the Google logo.
// You could also use a library like 'lucide-react' if it's installed.
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);


// A dedicated component for the Google Login Button
const GoogleLoginButton = () => {
    // The button is a link to the backend route that starts the Google OAuth flow.
    return (
        <a href="http://localhost:5001/api/auth/google" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <GoogleIcon />
                Sign in with Google
            </Button>
        </a>
    );
};


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
    const [error, setError] = useState<string | null>(null);
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
        setError(null); // Reset error on new submission
        try {
            const payload = {
                ...registerForm,
                skillsOffered: registerForm.skillsOffered.split(",").map(s => s.trim()).filter(s => s),
                skillsWanted: registerForm.skillsWanted.split(",").map(s => s.trim()).filter(s => s),
            };

            await axios.post(
                "http://localhost:5001/api/auth/register",
                payload,
                { withCredentials: true }
            );

            // Instead of alert, switch to login view on success
            setIsRegister(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    // Submit Login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on new submission
        try {
            await axios.post(
                "http://localhost:5001/api/auth/login",
                loginForm,
                { withCredentials: true }
            );
            navigate("/dashboard"); // Redirect after login
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 sm:mt-20 p-6 md:p-8 bg-card text-card-foreground rounded-xl border shadow-lg">
            {isRegister ? (
                <>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
                        <p className="text-sm text-muted-foreground">Enter your details to get started.</p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <Input placeholder="Name" name="name" value={registerForm.name} onChange={handleRegisterChange} required />
                        <Input placeholder="Email" name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} required />
                        <Input placeholder="Password" name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} required />
                        <textarea
                            placeholder="A short bio about yourself..."
                            name="bio"
                            value={registerForm.bio}
                            onChange={handleRegisterChange}
                            className="w-full min-h-[80px] p-2 bg-background border rounded-md text-sm"
                        />
                        <Input placeholder="Skills you can offer (e.g., React, Node.js)" name="skillsOffered" value={registerForm.skillsOffered} onChange={handleRegisterChange} />
                        <Input placeholder="Skills you want to learn" name="skillsWanted" value={registerForm.skillsWanted} onChange={handleRegisterChange} />
                        
                        {error && <p className="text-sm text-center text-destructive">{error}</p>}
                        
                        <Button type="submit" className="w-full">Create Account</Button>
                    </form>

                    <div className="my-4 flex items-center">
                        <div className="flex-grow border-t border-muted"></div>
                        <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">OR</span>
                        <div className="flex-grow border-t border-muted"></div>
                    </div>
                    
                    <GoogleLoginButton />

                    <p className="mt-6 text-center text-sm">
                        Already have an account?{" "}
                        <button
                            className="text-primary hover:underline font-medium"
                            onClick={() => { setIsRegister(false); setError(null); }}
                        >
                            Sign In
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to continue to SkillSwap.</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <Input placeholder="Email" name="email" type="email" value={loginForm.email} onChange={handleLoginChange} required />
                        <Input placeholder="Password" name="password" type="password" value={loginForm.password} onChange={handleLoginChange} required />
                        
                        {error && <p className="text-sm text-center text-destructive">{error}</p>}

                        <Button type="submit" className="w-full">Sign In</Button>
                    </form>

                    <div className="my-4 flex items-center">
                        <div className="flex-grow border-t border-muted"></div>
                        <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">OR</span>
                        <div className="flex-grow border-t border-muted"></div>
                    </div>
                    
                    <GoogleLoginButton />

                    <p className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <button
                            className="text-primary hover:underline font-medium"
                            onClick={() => { setIsRegister(true); setError(null); }}
                        >
                            Sign Up
                        </button>
                    </p>
                </>
            )}
        </div>
    );
};

export default Auth;
