import React from "react";
import type { User } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
    conversations: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
}

const ConversationList: React.FC<Props> = ({
    conversations,
    selectedUser,
    onSelectUser,
}) => {
    return (
        <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Chats</h2>
            <ul>
                {conversations.map((user) => (
                    <li
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className={`flex items-center p-2 cursor-pointer rounded ${selectedUser?._id === user._id ? "bg-gray-200" : ""
                            }`}
                    >
                        <Avatar className="w-12 h-12 ring-1 ring-gray-300 mr-3">
                            <AvatarImage src={user.profilePicture || ""} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;
