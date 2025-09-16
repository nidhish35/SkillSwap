import React from "react";
import type { User, Message } from "../types";
import MessageInput from "./MessageInput";
import { Socket } from "socket.io-client";

interface Props {
    messages: Message[];
    socket: Socket | null;
    recipient: User;
}

const ChatWindow: React.FC<Props> = ({ messages, socket, recipient }) => {
    return (
        <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">{recipient.name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`p-2 rounded max-w-xs ${msg.from === recipient._id
                                ? "bg-gray-200 self-start"
                                : "bg-blue-500 text-white self-end"
                            }`}
                    >
                        {msg.text}
                        <div className="text-xs text-gray-600 mt-1">{msg.status}</div>
                    </div>
                ))}
            </div>
            <MessageInput socket={socket} recipientId={recipient._id} />
        </div>
    );
};

export default ChatWindow;
