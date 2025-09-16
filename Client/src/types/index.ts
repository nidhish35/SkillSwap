// src/types/index.ts
export interface User {
    _id: string;
    name: string;
    profilePicture?: string;
}

export interface Message {
    _id: string;
    from: string;
    to: string;
    text: string;
    status: "sent" | "delivered" | "seen";
    createdAt: string;
}
