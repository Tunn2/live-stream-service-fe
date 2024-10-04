import { ReceivedChatMessage } from "@livekit/components-react";
import { MessageSquareOff } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useEffect, useRef } from "react";

interface ChatListProps {
    messages: ReceivedChatMessage[],
    isHidden: boolean,
};

export const ChatList = ({
    messages,
    isHidden,
}: ChatListProps) => {
    const lastMessageRef = useRef(null);
    
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isHidden || !messages || messages.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <p style={{ padding: "20px" }}>
                    {isHidden ? <div className="d-flex gap-2"><span>Chat is disabled</span><MessageSquareOff /></div> : "Welcome to chat"}
                </p>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column p-2 h-100" style={{ width: "100%", overflowY: "auto" }}>
            {messages && messages.map((message) => (
              <ChatMessage
                key={message.timestamp}
                data={message}
              />
            ))}
            <div ref={lastMessageRef} />
        </div>
    );
};