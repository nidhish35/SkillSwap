import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    socket: Socket | null;
    recipientId: string;
}

const MessageInput: React.FC<Props> = ({ socket, recipientId }) => {
    const [text, setText] = useState("");

    const sendMessage = () => {
        if (!text.trim() || !socket) return;
        socket.emit("privateMessage", { to: recipientId, text });
        setText("");
    };

    return (
        <div className="p-4 border-t border-gray-200 flex gap-2">
            <Input
                className="flex-1"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
        </div>
    );
};

export default MessageInput;
