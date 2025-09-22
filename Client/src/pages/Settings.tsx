"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import axios from "axios";

const API_URL = "http://20.255.50.15:5001"; // your VM public IP


const Settings: React.FC = () => {

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);




    return (
        <><div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6 pb-20 space-y-6">

                {/* Preferences Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your app experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Dark Mode</span>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Notifications</span>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Security Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>Manage password & authentication</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label htmlFor="change-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Change Password
                        </label>
                        <Input id="change-password" type="password" placeholder="New Password" />
                        <div className="flex items-center justify-between">
                            <span>Two-Factor Authentication</span>
                            <Switch checked={false} onCheckedChange={() => { }} />
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border border-red-300 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>Be careful with these actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                const confirmed = confirm(
                                    "Are you sure you want to delete your account? This action cannot be undone."
                                );
                                if (!confirmed) return;

                                try {
                                    await axios.delete(`${API_URL}/api/auth/delete`, {
                                        withCredentials: true,
                                    });

                                    // Clear frontend user data (if using context/localStorage)
                                    localStorage.removeItem("user"); // optional if storing user locally
                                    // You can also clear any state in a context or Redux store

                                    // Reload the app to remove user session
                                    window.location.href = "/"; // redirect to homepage/login

                                } catch (error) {
                                    console.error("Error deleting account:", error);
                                    alert("Failed to delete account.");
                                }
                            }}
                        >
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <BottomBar />
        </div>
        </>
    );
};

export default Settings;
