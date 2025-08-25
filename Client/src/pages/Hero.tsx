interface HeroProps {
    onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
    return (
        <div className="text-center max-w-2xl bg-white p-10 rounded-2xl shadow-2xl">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
                Welcome to SkillSwap 🚀
            </h1>
            <p className="text-lg text-gray-700 mb-6">
                A platform where people exchange knowledge — <br />
                <span className="font-semibold text-purple-600">I’ll teach you Cloud ☁️, you teach me Python 🐍</span>.
            </p>

            <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
            >
                Get Started
            </button>

            <div className="mt-8 flex justify-center space-x-6 text-gray-600">
                <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
                    🔒 Secure Authentication
                </div>
                <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
                    🎥 Video Calling
                </div>
                <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
                    💬 Real-time Chat
                </div>
            </div>
        </div>
    );
}
