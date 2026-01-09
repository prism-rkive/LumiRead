import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Info, Camera, ArrowLeft, Save } from "lucide-react";
import api from "../service/api";
import useTheme from "../hooks/useTheme";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        avatar: "",
        bio: "",
        age: "",
    });

    const fileInputRef = React.useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
                const token = currentUser.token;
                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await api.get("/api/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data) {
                    setFormData({
                        name: res.data.name || "",
                        email: res.data.email || "",
                        avatar: res.data.avatar || "",
                        bio: res.data.bio || "",
                        age: res.data.age || "",
                    });
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("image", file);

        setSaving(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            const token = currentUser.token;

            const res = await api.post("/api/upload", uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.image) {
                setFormData((prev) => ({ ...prev, avatar: res.data.image }));
                setSuccess("Image uploaded! Don't forget to save your profile.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to upload image");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            const token = currentUser.token;

            const res = await api.put("/api/user/profile", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.status) {
                setSuccess("Profile updated successfully!");
                // Update local storage if needed
                const updatedUser = { ...currentUser, name: res.data.name, email: res.data.email };
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error(err);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-gray-700 dark:text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center text-red-700 dark:text-red-400 font-semibold mb-8 hover:underline"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back to Home
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-32 bg-red-600 dark:bg-red-800"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-8 flex flex-col items-center">
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <img
                                    src={
                                        formData.avatar
                                            ? (formData.avatar.startsWith("http") ? formData.avatar : `http://localhost:5000${formData.avatar}`)
                                            : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + formData.name
                                    }
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 object-cover shadow-lg transition-opacity group-hover:opacity-75"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/40 p-2 rounded-full text-white">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={uploadFileHandler}
                                />
                            </div>
                            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                                {formData.name || "Your Profile"}
                            </h1>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-xl">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-r-xl">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                        <User className="w-4 h-4 mr-2" /> Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                        <Mail className="w-4 h-4 mr-2" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                        <Camera className="w-4 h-4 mr-2" /> Profile Picture URL
                                    </label>
                                    <input
                                        type="text"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        placeholder="Enter image URL"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" /> Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        placeholder="Your age"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                    <Info className="w-4 h-4 mr-2" /> Bio
                                </label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="Tell us about yourself..."
                                ></textarea>
                            </div>

                            <div className="flex justify-center pt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    {saving ? "Saving Changes..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
