import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar"; // Import the Navbar component

interface Feedback {
    userId: { name: string; email: string; profilePicture?: string };
    comment: string;
    rating: number;
    date: string;
}

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    rating: number;
    feedbacks: Feedback[];
    onlineStatus: boolean;
    lastLogin?: string;
    createdAt: string;
    googleId?: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get<UserProfile>(
                    `http://host.docker.internal:5001/api/users/me`,
                    { withCredentials: true }
                );
                setUser(res.data as UserProfile);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (field: keyof UserProfile, value: any) => {
        if (!user) return;
        setUser({ ...user, [field]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        try {
            if (!user) return;

            // Upload profile picture if a new file is selected
            if (file) {
                const formData = new FormData();
                formData.append("profilePicture", file);

                const uploadRes = await axios.post(
                    "http://host.docker.internal:5001/api/upload/profile-picture",
                    formData,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                setUser(uploadRes.data as UserProfile);
                setFile(null);
                setPreview(null);
            }

            // Save other updates
            const res = await axios.put(
                `http://host.docker.internal:5001/api/users/me`,
                {
                    name: user.name,
                    bio: user.bio,
                    skillsOffered: user.skillsOffered,
                    skillsWanted: user.skillsWanted,
                },
                { withCredentials: true }
            );
            setUser(res.data as UserProfile);

            setEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!user) return <p className="text-center text-red-500">User not found</p>;

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto mt-10">
                <Card className="shadow-lg rounded-2xl border border-gray-200">
                    <CardHeader className="flex flex-col items-center space-y-3">
                        <Avatar className="w-24 h-24">
                            <AvatarImage
                                src={
                                    preview
                                        ? preview
                                        : user.profilePicture
                                            ? user.profilePicture.startsWith("http")
                                                ? user.profilePicture
                                                : `http://host.docker.internal:5001${user.profilePicture}` // <-- added slash here
                                            : undefined
                                }
                                alt={user.name}
                            />
                            <AvatarFallback>
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>



                        {editing && (
                            <div className="mt-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {preview && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        New picture selected
                                    </p>
                                )}
                            </div>
                        )}

                        <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary">⭐ {user.rating.toFixed(1)} / 5</Badge>
                            <Badge variant={user.onlineStatus ? "default" : "outline"}>
                                {user.onlineStatus ? "🟢 Online" : "⚪ Offline"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{user.email}</p>
                    </CardHeader>

                    <Separator className="my-2" />

                    <CardContent className="space-y-6">
                        {/* Bio */}
                        <div>
                            <label className="text-sm font-medium">Bio</label>
                            <Textarea
                                value={user.bio || ""}
                                disabled={!editing}
                                onChange={(e) => handleChange("bio", e.target.value)}
                                placeholder="Tell something about yourself"
                                className="mt-1"
                            />
                        </div>

                        {/* Skills */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Skills Offered</label>
                                <Input
                                    value={user.skillsOffered.join(", ")}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        handleChange(
                                            "skillsOffered",
                                            e.target.value.split(",").map((s) => s.trim())
                                        )
                                    }
                                    placeholder="e.g. Web Dev, Graphic Design"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Skills Wanted</label>
                                <Input
                                    value={user.skillsWanted.join(", ")}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        handleChange(
                                            "skillsWanted",
                                            e.target.value.split(",").map((s) => s.trim())
                                        )
                                    }
                                    placeholder="e.g. Marketing, SEO"
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Feedbacks */}
                        <div>
                            <h3 className="text-lg font-semibold">Feedbacks</h3>
                            {user.feedbacks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No feedbacks yet.
                                </p>
                            ) : (
                                <ul className="space-y-3 mt-2">
                                    {user.feedbacks.map((f, i) => (
                                        <li
                                            key={i}
                                            className="p-3 border rounded-lg bg-gray-50 flex flex-col"
                                        >
                                            <span className="font-medium">{f.userId.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {f.comment}
                                            </span>
                                            <span className="text-xs">⭐ {f.rating}/5</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4 mt-6">
                            {editing ? (
                                <>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                    <Button variant="outline" onClick={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ProfilePage;
