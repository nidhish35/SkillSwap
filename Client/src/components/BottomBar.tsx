import React from "react";
import { Button } from "@/components/ui/button";

const BottomBar: React.FC = () => {
    return (
        <div className="bg-white shadow-inner p-2 flex justify-around">
            <Button>Home</Button>
            <Button>Explore</Button>
            <Button>Post</Button>
            <Button>Settings</Button>
        </div>
    );
};

export default BottomBar;
