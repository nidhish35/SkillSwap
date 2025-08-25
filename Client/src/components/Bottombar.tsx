const BottomBar = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner flex justify-around py-3 z-10">
            <button className="text-indigo-600 font-semibold">🏠 Home</button>
            <button className="text-gray-600 font-semibold">👤 Profile</button>
            <button className="text-gray-600 font-semibold">💬 Chat</button>
        </div>
    );
};

export default BottomBar;
