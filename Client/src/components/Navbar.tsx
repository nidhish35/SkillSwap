const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex justify-between items-center z-10">
            <h1 className="text-xl font-bold text-indigo-600">SkillSwap 🚀</h1>
            <div className="space-x-4">
                <button className="text-gray-700 font-medium hover:text-indigo-600">Home</button>
                <button className="text-gray-700 font-medium hover:text-indigo-600">Profile</button>
                <button className="text-gray-700 font-medium hover:text-indigo-600">Messages</button>
            </div>
        </div>
    );
};

export default Navbar;
