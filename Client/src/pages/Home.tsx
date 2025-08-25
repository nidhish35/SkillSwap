// Home.tsx
import BottomBar from "../components/Bottombar";
import Navbar from "../components/Navbar";

interface HomeProps {
    user: any;               // or a proper User type if you have one
    onLogout: () => Promise<void>;
}

export default function Home({ user, onLogout }: HomeProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="flex-1 mt-16 mb-16 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome, {user?.username || "Guest"} 👋
                    </h2>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                <p className="text-gray-600">
                    Here you’ll see posts from people offering skills to teach & skills they want to learn.
                </p>

                {/* Example posts */}
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-white shadow-md rounded-xl">
                        <h3 className="font-semibold text-indigo-600">John Doe</h3>
                        <p className="text-gray-700">Wants to learn: React ⚛️</p>
                        <p className="text-gray-700">Can teach: Python 🐍</p>
                    </div>
                    <div className="p-4 bg-white shadow-md rounded-xl">
                        <h3 className="font-semibold text-indigo-600">Alice</h3>
                        <p className="text-gray-700">Wants to learn: Cloud ☁️</p>
                        <p className="text-gray-700">Can teach: JavaScript 📜</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navbar */}
            <BottomBar />
        </div>
    );
}
