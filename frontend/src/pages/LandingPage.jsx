import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogIn, UserPlus } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center font-sans text-center px-4">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                {/* Logo / Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-6 bg-red-600 rounded-full shadow-2xl skew-y-3 transform hover:rotate-12 transition-transform duration-500">
                        <BookOpen className="w-16 h-16 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Welcome to <span className="text-red-600">LumiRead</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Your personal sanctuary for tracking books, discovering new worlds, and connecting with a vibrant community of readers.
                </p>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-red-600 rounded-xl shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300 ring-2 ring-red-500 ring-offset-2 dark:ring-offset-gray-900"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                    </button>

                    <button
                        onClick={() => navigate("/login")} // Assuming same page for now, or separate if needed
                        className="flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:bg-gray-50 hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Get Started
                    </button>
                </div>
            </div>

            {/* Footer / Stats (Decorative) */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-500 dark:text-gray-400 opacity-80">
                <div>
                    <span className="block text-3xl font-bold text-gray-800 dark:text-white">10k+</span>
                    Books Tracked
                </div>
                <div>
                    <span className="block text-3xl font-bold text-gray-800 dark:text-white">5k+</span>
                    Active Readers
                </div>
                <div>
                    <span className="block text-3xl font-bold text-gray-800 dark:text-white">Unlimited</span>
                    Inspiration
                </div>
            </div>
        </div>
    );
}
